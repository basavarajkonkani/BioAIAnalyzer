"""
Integration tests for history endpoints.
Tests /history endpoints with authentication and access control.
"""
import pytest


@pytest.fixture
def sample_analysis(client, auth_headers):
    """Create a sample analysis for testing history."""
    response = client.post("/analyze",
        headers=auth_headers,
        json={
            "sequence": "ATGCATGCATGC",
            "sequence_type": "DNA"
        }
    )
    assert response.status_code == 200
    return response.json()


def test_get_history_authenticated(client, auth_headers, sample_analysis):
    """Test retrieving user history with valid authentication."""
    response = client.get("/history", headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    
    # Check first record structure
    record = data[0]
    assert "id" in record
    assert "sequence_type" in record
    assert "input_sequence" in record
    assert "results" in record
    assert "created_at" in record


def test_get_history_unauthorized(client):
    """Test retrieving history without authentication returns 401."""
    response = client.get("/history")
    
    assert response.status_code == 401


def test_get_history_with_pagination(client, auth_headers, sample_analysis):
    """Test history pagination with limit and offset."""
    # Create multiple analyses
    for i in range(3):
        client.post("/analyze",
            headers=auth_headers,
            json={
                "sequence": "ATGC" * (i + 1),
                "sequence_type": "DNA"
            }
        )
    
    # Test with limit
    response = client.get("/history?limit=2", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) <= 2
    
    # Test with offset
    response = client.get("/history?offset=1", headers=auth_headers)
    assert response.status_code == 200


def test_get_history_max_limit(client, auth_headers):
    """Test history respects maximum limit of 100."""
    response = client.get("/history?limit=200", headers=auth_headers)
    
    assert response.status_code == 422


def test_get_single_analysis_success(client, auth_headers, sample_analysis):
    """Test retrieving a single analysis by ID."""
    # First, get the history to find an analysis ID
    history_response = client.get("/history", headers=auth_headers)
    analyses = history_response.json()
    assert len(analyses) > 0
    
    analysis_id = analyses[0]["id"]
    
    # Get single analysis
    response = client.get(f"/history/{analysis_id}", headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == analysis_id
    assert "sequence_type" in data
    assert "input_sequence" in data
    assert "results" in data


def test_get_single_analysis_not_found(client, auth_headers):
    """Test retrieving non-existent analysis returns 404."""
    response = client.get("/history/99999", headers=auth_headers)
    
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_single_analysis_unauthorized(client, sample_analysis):
    """Test retrieving analysis without authentication returns 401."""
    response = client.get("/history/1")
    
    assert response.status_code == 401


def test_get_single_analysis_access_denied(client, db, sample_analysis):
    """Test retrieving another user's analysis returns 403."""
    # Create a second user
    from app.models.user import User
    from app.utils.security import get_password_hash
    
    user2 = User(
        name="User Two",
        email="user2@example.com",
        hashed_password=get_password_hash("password123")
    )
    db.add(user2)
    db.commit()
    
    # Login as second user
    login_response = client.post("/auth/login", json={
        "email": "user2@example.com",
        "password": "password123"
    })
    user2_token = login_response.json()["access_token"]
    user2_headers = {"Authorization": f"Bearer {user2_token}"}
    
    # Get first user's history to find an analysis ID
    from app.crud import analysis as crud_analysis
    from app.models.user import User as UserModel
    
    user1 = db.query(UserModel).filter(UserModel.email == "test@example.com").first()
    analyses = crud_analysis.get_user_analyses(db, user1.id, limit=1, offset=0)
    
    if analyses:
        analysis_id = analyses[0].id
        
        # Try to access first user's analysis as second user
        response = client.get(f"/history/{analysis_id}", headers=user2_headers)
        
        assert response.status_code == 403
        assert "access denied" in response.json()["detail"].lower()


def test_delete_analysis_success(client, auth_headers, sample_analysis):
    """Test deleting an analysis record."""
    # Get history to find an analysis ID
    history_response = client.get("/history", headers=auth_headers)
    analyses = history_response.json()
    assert len(analyses) > 0
    
    analysis_id = analyses[0]["id"]
    
    # Delete the analysis
    response = client.delete(f"/history/{analysis_id}", headers=auth_headers)
    
    assert response.status_code == 204
    
    # Verify it's deleted
    get_response = client.get(f"/history/{analysis_id}", headers=auth_headers)
    assert get_response.status_code == 404


def test_delete_analysis_not_found(client, auth_headers):
    """Test deleting non-existent analysis returns 404."""
    response = client.delete("/history/99999", headers=auth_headers)
    
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_delete_analysis_unauthorized(client):
    """Test deleting analysis without authentication returns 401."""
    response = client.delete("/history/1")
    
    assert response.status_code == 401


def test_delete_analysis_access_denied(client, db, sample_analysis):
    """Test deleting another user's analysis returns 403."""
    # Create a second user
    from app.models.user import User
    from app.utils.security import get_password_hash
    
    user2 = User(
        name="User Two",
        email="user2@example.com",
        hashed_password=get_password_hash("password123")
    )
    db.add(user2)
    db.commit()
    
    # Login as second user
    login_response = client.post("/auth/login", json={
        "email": "user2@example.com",
        "password": "password123"
    })
    user2_token = login_response.json()["access_token"]
    user2_headers = {"Authorization": f"Bearer {user2_token}"}
    
    # Get first user's history to find an analysis ID
    from app.crud import analysis as crud_analysis
    from app.models.user import User as UserModel
    
    user1 = db.query(UserModel).filter(UserModel.email == "test@example.com").first()
    analyses = crud_analysis.get_user_analyses(db, user1.id, limit=1, offset=0)
    
    if analyses:
        analysis_id = analyses[0].id
        
        # Try to delete first user's analysis as second user
        response = client.delete(f"/history/{analysis_id}", headers=user2_headers)
        
        assert response.status_code == 403
        assert "access denied" in response.json()["detail"].lower()
