"""
Test configuration and fixtures.
"""
import pytest
import os

# Set environment variable to use SQLite for tests
os.environ["DATABASE_URL"] = "sqlite:///:memory:"


@pytest.fixture
def db():
    """Create test database session with in-memory SQLite."""
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from app.database import Base
    
    # Create a separate engine for testing
    test_engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(test_engine)
    
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(test_engine)


@pytest.fixture
def client(db):
    """Create test client with database override."""
    from fastapi.testclient import TestClient
    from app.main import app
    from app.database import get_db
    
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db):
    """Create a test user in the database."""
    from app.models.user import User
    from app.utils.security import get_password_hash
    
    user = User(
        name="Test User",
        email="test@example.com",
        hashed_password=get_password_hash("password123")
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def auth_headers(client, test_user):
    """Get authentication headers with JWT token for test user."""
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
