"""
Unit tests for the authentication service.
"""
import pytest
from fastapi import HTTPException
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate
from app.utils.security import verify_password, decode_jwt_token


class TestUserRegistration:
    """Tests for user registration."""
    
    def test_register_user_success(self, db):
        """Test successful user registration."""
        service = AuthService(db)
        user_data = UserCreate(
            name="New User",
            email="newuser@example.com",
            password="password123"
        )
        
        user = service.register_user(user_data)
        
        assert user.id is not None
        assert user.name == "New User"
        assert user.email == "newuser@example.com"
        assert user.hashed_password is not None
        assert user.hashed_password != "password123"
    
    def test_register_user_duplicate_email(self, db, test_user):
        """Test registration fails with duplicate email."""
        service = AuthService(db)
        user_data = UserCreate(
            name="Another User",
            email=test_user.email,
            password="password123"
        )
        
        with pytest.raises(HTTPException) as exc_info:
            service.register_user(user_data)
        
        assert exc_info.value.status_code == 400
        assert "already registered" in exc_info.value.detail.lower()
    
    def test_register_user_password_hashed(self, db):
        """Test that password is properly hashed."""
        service = AuthService(db)
        user_data = UserCreate(
            name="Test User",
            email="test@example.com",
            password="mypassword"
        )
        
        user = service.register_user(user_data)
        
        # Password should be hashed, not plain text
        assert user.hashed_password != "mypassword"
        # Should be able to verify the password
        assert verify_password("mypassword", user.hashed_password)


class TestUserAuthentication:
    """Tests for user authentication."""
    
    def test_authenticate_user_success(self, db, test_user):
        """Test successful authentication with valid credentials."""
        service = AuthService(db)
        
        user = service.authenticate_user("test@example.com", "password123")
        
        assert user.id == test_user.id
        assert user.email == test_user.email
    
    def test_authenticate_user_invalid_email(self, db):
        """Test authentication fails with invalid email."""
        service = AuthService(db)
        
        with pytest.raises(HTTPException) as exc_info:
            service.authenticate_user("nonexistent@example.com", "password123")
        
        assert exc_info.value.status_code == 401
        assert "invalid" in exc_info.value.detail.lower()
    
    def test_authenticate_user_invalid_password(self, db, test_user):
        """Test authentication fails with invalid password."""
        service = AuthService(db)
        
        with pytest.raises(HTTPException) as exc_info:
            service.authenticate_user(test_user.email, "wrongpassword")
        
        assert exc_info.value.status_code == 401
        assert "invalid" in exc_info.value.detail.lower()


class TestJWTTokenCreation:
    """Tests for JWT token creation and validation."""
    
    def test_create_access_token(self, db, test_user):
        """Test JWT token creation."""
        service = AuthService(db)
        
        token = service.create_access_token(test_user)
        
        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0
    
    def test_token_contains_user_data(self, db, test_user):
        """Test that token contains user ID and email."""
        service = AuthService(db)
        
        token = service.create_access_token(test_user)
        payload = decode_jwt_token(token)
        
        assert payload["sub"] == str(test_user.id)
        assert payload["email"] == test_user.email
    
    def test_token_has_expiration(self, db, test_user):
        """Test that token has expiration time."""
        service = AuthService(db)
        
        token = service.create_access_token(test_user)
        payload = decode_jwt_token(token)
        
        assert "exp" in payload
        assert payload["exp"] is not None


class TestPasswordSecurity:
    """Tests for password hashing and verification."""
    
    def test_password_hashing(self):
        """Test password hashing produces different hashes."""
        from app.utils.security import get_password_hash
        
        password = "testpassword"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)
        
        # Hashes should be different due to salt
        assert hash1 != hash2
        # But both should verify correctly
        assert verify_password(password, hash1)
        assert verify_password(password, hash2)
    
    def test_password_verification(self):
        """Test password verification."""
        from app.utils.security import get_password_hash
        
        password = "mypassword"
        hashed = get_password_hash(password)
        
        # Correct password should verify
        assert verify_password(password, hashed)
        # Wrong password should not verify
        assert not verify_password("wrongpassword", hashed)
