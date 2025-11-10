"""
Integration tests for authentication endpoints.
Tests /auth/register and /auth/login endpoints.
"""
import pytest


def test_register_user_success(client, db):
    """Test successful user registration."""
    response = client.post("/auth/register", json={
        "name": "New User",
        "email": "newuser@example.com",
        "password": "password123"
    })
    
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["name"] == "New User"
    assert "id" in data
    assert "created_at" in data
    assert "password" not in data
    assert "hashed_password" not in data


def test_register_duplicate_email(client, test_user):
    """Test registration with existing email returns 400."""
    response = client.post("/auth/register", json={
        "name": "Another User",
        "email": "test@example.com",  # Already exists
        "password": "password123"
    })
    
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()


def test_register_invalid_email(client):
    """Test registration with invalid email format."""
    response = client.post("/auth/register", json={
        "name": "Test User",
        "email": "invalid-email",
        "password": "password123"
    })
    
    assert response.status_code == 422


def test_register_short_password(client):
    """Test registration with password less than 8 characters."""
    response = client.post("/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "short"
    })
    
    assert response.status_code == 422


def test_login_success(client, test_user):
    """Test successful login with valid credentials."""
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "user" in data
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["name"] == "Test User"


def test_login_invalid_email(client, test_user):
    """Test login with non-existent email."""
    response = client.post("/auth/login", json={
        "email": "nonexistent@example.com",
        "password": "password123"
    })
    
    assert response.status_code == 401
    assert "invalid" in response.json()["detail"].lower()


def test_login_invalid_password(client, test_user):
    """Test login with incorrect password."""
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "wrongpassword"
    })
    
    assert response.status_code == 401
    assert "invalid" in response.json()["detail"].lower()


def test_login_missing_fields(client):
    """Test login with missing required fields."""
    response = client.post("/auth/login", json={
        "email": "test@example.com"
    })
    
    assert response.status_code == 422
