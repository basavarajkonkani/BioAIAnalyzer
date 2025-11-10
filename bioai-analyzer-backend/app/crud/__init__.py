"""
CRUD operations module.
"""
from app.crud.user import get_user_by_email, get_user_by_id, create_user
from app.crud.analysis import (
    create_analysis,
    get_user_analyses,
    get_analysis_by_id,
    delete_analysis
)

__all__ = [
    # User CRUD
    "get_user_by_email",
    "get_user_by_id",
    "create_user",
    # Analysis CRUD
    "create_analysis",
    "get_user_analyses",
    "get_analysis_by_id",
    "delete_analysis",
]
