"""
User database model.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Index
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    """
    User model for storing user account information.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationship to analyses with cascade delete
    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', name='{self.name}')>"


# Create unique index on email field (already handled by unique=True in Column definition)
