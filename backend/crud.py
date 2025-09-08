# crud.py

from sqlalchemy.orm import Session
from datetime import datetime
import models 

# -----------------------
# User CRUD
# -----------------------
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, username: str):
    user = models.User(username=username)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# -----------------------
# Message CRUD
# -----------------------
def create_message(db: Session, sender_id: int, recipient_id: int, content: str):
    message = models.Message(
        sender_id=sender_id,
        recipient_id=recipient_id,
        content=content
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

def get_messages_between_users(db: Session, user1_id: int, user2_id: int):
    return db.query(models.Message).filter(
        ((models.Message.sender_id == user1_id) & (models.Message.recipient_id == user2_id)) |
        ((models.Message.sender_id == user2_id) & (models.Message.recipient_id == user1_id))
    ).order_by(models.Message.timestamp).all()

def mark_message_as_read(db: Session, message_id: int):
    message = db.query(models.Message).get(message_id)
    if message:
        message.read = True
        db.commit()
    return message

def mark_message_as_delivered(db: Session, message_id: int):
    message = db.query(models.Message).get(message_id)
    if message:
        message.delivered = True
        db.commit()
    return message

def create_user(db: Session, username: str):
    db_user = models.User(username=username, password_hash="")  # empty hash for now
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

