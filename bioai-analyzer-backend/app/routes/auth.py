"""
Authentication routes for user registration and login.
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.schemas.auth import Token
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    
    Creates a new user account with the provided name, email, and password.
    The password is hashed before storage.
    
    Args:
        user_data: User registration data (name, email, password)
        db: Database session dependency
        
    Returns:
        UserResponse: Created user data (id, name, email, created_at)
        
    Raises:
        HTTPException 400: If email already exists
        HTTPException 422: If validation fails
    """
    auth_service = AuthService(db)
    user = auth_service.register_user(user_data)
    return user


@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return JWT token.
    
    Validates user credentials and returns a JWT access token
    with 24-hour expiration along with user profile data.
    
    Args:
        credentials: User login credentials (email, password)
        db: Database session dependency
        
    Returns:
        Token: JWT access token, token type, and user data
        
    Raises:
        HTTPException 401: If credentials are invalid
        HTTPException 422: If validation fails
    """
    auth_service = AuthService(db)
    
    # Authenticate user
    user = auth_service.authenticate_user(credentials.email, credentials.password)
    
    # Create access token
    access_token = auth_service.create_access_token(user)
    
    # Return token with user data
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )
