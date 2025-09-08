from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Dict
from database import SessionLocal, engine
from fastapi import HTTPException
import models
import crud

# -----------------------
# Create all database tables
# -----------------------
models.Base.metadata.create_all(bind=engine)

# -----------------------
# FastAPI app and CORS setup
# -----------------------
app = FastAPI(title="ChatApp Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:3001"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Dependency: DB session
# -----------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------
# Root endpoint
# -----------------------
@app.get("/")
def read_root():
    return {"message": "Hello, ChatApp backend is running!"}

# -----------------------
# Users endpoint (NEW)
# -----------------------
@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return [{"id": u.id, "username": u.username} for u in users]

# -----------------------
# WebSocket Connection Manager
# -----------------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        self.active_connections.pop(user_id, None)

    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            await websocket.send_json(message)

manager = ConnectionManager()

# -----------------------
# User Login Endpoint
# -----------------------
@app.get("/login")
def login(username: str, db: Session = Depends(get_db)):
    # Check if user exists
    user = crud.get_user_by_username(db, username)
    
    if not user:
        # If not, create the user automatically
        user = crud.create_user(db, username)
    
    return {"userId": user.id, "username": user.username}


# -----------------------
# WebSocket Endpoint
# -----------------------
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, db: Session = Depends(get_db)):
    user_id = int(user_id)
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            sender_id = int(data["sender_id"])
            recipient_id = int(data["recipient_id"])
            content = data["content"]

            # Save message in database
            message = crud.create_message(db, sender_id, recipient_id, content)

            # Send to recipient if online
            await manager.send_personal_message({
                "id": message.id,
                "sender_id": sender_id,
                "recipient_id": recipient_id,
                "content": content,
                "timestamp": str(message.timestamp),
                "delivered": message.delivered,
                "read": message.read
            }, recipient_id)

            # Send confirmation to sender
            await manager.send_personal_message({
                "id": message.id,
                "sender_id": sender_id,
                "recipient_id": recipient_id,
                "content": content,
                "timestamp": str(message.timestamp),
                "delivered": message.delivered,
                "read": message.read
            }, sender_id)

    except WebSocketDisconnect:
        manager.disconnect(user_id)

# -----------------------
# REST Endpoints for Messages
# -----------------------
@app.get("/messages/{user_id}/{recipient_id}")
def get_messages(user_id: int, recipient_id: int, db: Session = Depends(get_db)):
    return crud.get_messages_between_users(db, user_id, recipient_id)

@app.put("/messages/{message_id}/read")
def mark_as_read(message_id: int, db: Session = Depends(get_db)):
    return crud.mark_message_as_read(db, message_id)

@app.put("/messages/{message_id}/delivered")
def mark_as_delivered(message_id: int, db: Session = Depends(get_db)):
    return crud.mark_message_as_delivered(db, message_id)
