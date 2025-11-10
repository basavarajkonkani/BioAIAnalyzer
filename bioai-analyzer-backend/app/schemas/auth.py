from pydantic import BaseModel
from .user import UserResponse


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    """Schema for decoded JWT token data."""
    user_id: int
    email: str
