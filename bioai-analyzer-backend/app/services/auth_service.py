"""
Authentication service for user registration, login, and token management.
"""
from datetime import timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserCreate
from app.crud import user as user_crud
from app.utils.security import (
    get_password_hash,
    verify_password,
    create_jwt_token,
    ACCESS_TOKEN_EXPIRE_HOURS
)


class AuthService:
    """
    Service class for handling authentication operations.
    
    This service manages user registration, authentication, and JWT token generation.
    """
    
    def __init__(self, db: Session):
        """
        Initialize the authentication service.
        
        Args:
            db: Database session for performing database operations
        """
        self.db = db
    
    def register_user(self, user_data: UserCreate) -> User:
        """
        Register a new user with hashed password.
        
        This method checks if the email already exists in the database,
        hashes the password, and creates a new user record.
        
        Args:
            user_data: User registration data containing name, email, and password
            
        Returns:
            Created User object
            
        Raises:
            HTTPException: 400 if email already exists
        """
        # Check if email already exists
        existing_user = user_crud.get_user_by_email(self.db, user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash the password
        hashed_password = get_password_hash(user_data.password)
        
        # Create the user
        user = user_crud.create_user(self.db, user_data, hashed_password)
        
        return user
    
    def authenticate_user(self, email: str, password: str) -> User:
        """
        Authenticate user credentials.
        
        This method validates the user's email and password combination.
        
        Args:
            email: User's email address
            password: User's plain text password
            
        Returns:
            User object if credentials are valid
            
        Raises:
            HTTPException: 401 if credentials are invalid
        """
        # Retrieve user by email
        user = user_crud.get_user_by_email(self.db, email)
        
        # Verify user exists and password is correct
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return user
    
    def create_access_token(self, user: User) -> str:
        """
        Create JWT access token for authenticated user.
        
        This method generates a JWT token containing the user's ID and email,
        with a 24-hour expiration time.
        
        Args:
            user: Authenticated User object
            
        Returns:
            JWT token string
        """
        # Prepare token data
        token_data = {
            "sub": str(user.id),
            "email": user.email
        }
        
        # Create token with expiration
        expires_delta = timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
        access_token = create_jwt_token(token_data, expires_delta)
        
        return access_token
