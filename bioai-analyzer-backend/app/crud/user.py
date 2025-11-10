"""
User CRUD operations.
"""
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate


def get_user_by_email(db: Session, email: str) -> User | None:
    """
    Retrieve a user by email address.
    
    Args:
        db: Database session
        email: User's email address
        
    Returns:
        User object if found, None otherwise
    """
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    """
    Retrieve a user by ID.
    
    Args:
        db: Database session
        user_id: User's ID
        
    Returns:
        User object if found, None otherwise
    """
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user_data: UserCreate, hashed_password: str) -> User:
    """
    Create a new user with hashed password.
    
    Args:
        db: Database session
        user_data: User creation data (name, email, password)
        hashed_password: Pre-hashed password
        
    Returns:
        Created User object
    """
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
