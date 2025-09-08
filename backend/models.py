from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

# ------------------------
# User Model
# ------------------------
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    
    sent_messages = relationship("Message", back_populates="sender", foreign_keys='Message.sender_id')
    received_messages = relationship("Message", back_populates="recipient", foreign_keys='Message.recipient_id')


# ------------------------
# Message Model
# ------------------------
class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String(500), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    read = Column(Boolean, default=False)       # renamed from is_read
    delivered = Column(Boolean, default=False)  # added to match main.py WebSocket logic
    
    sender = relationship("User", back_populates="sent_messages", foreign_keys=[sender_id])
    recipient = relationship("User", back_populates="received_messages", foreign_keys=[recipient_id])


# ------------------------
# Pydantic Schemas
# ------------------------
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class MessageCreate(BaseModel):
    sender_id: int
    recipient_id: int
    content: str

class MessageOut(BaseModel):
    id: int
    sender_id: int
    recipient_id: int
    content: str
    timestamp: datetime
    read: bool        # renamed to match model
    delivered: bool   # added to match model

    class Config:
        from_attributes = True
