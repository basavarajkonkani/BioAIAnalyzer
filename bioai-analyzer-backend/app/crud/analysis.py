"""
Analysis CRUD operations.
"""
from sqlalchemy.orm import Session
from typing import List
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisRequest


def create_analysis(
    db: Session,
    user_id: int,
    request: AnalysisRequest,
    results: dict
) -> Analysis:
    """
    Create a new analysis record.
    
    Args:
        db: Database session
        user_id: ID of the user who performed the analysis
        request: Analysis request data (sequence, sequence_type)
        results: Analysis results as dictionary
        
    Returns:
        Created Analysis object
    """
    db_analysis = Analysis(
        user_id=user_id,
        sequence_type=request.sequence_type,
        input_sequence=request.sequence,
        results=results
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis


def get_user_analyses(
    db: Session,
    user_id: int,
    limit: int = 100,
    offset: int = 0
) -> List[Analysis]:
    """
    Retrieve analysis history for a user with pagination.
    
    Args:
        db: Database session
        user_id: ID of the user
        limit: Maximum number of records to return (default: 100)
        offset: Number of records to skip (default: 0)
        
    Returns:
        List of Analysis objects ordered by created_at descending
    """
    return (
        db.query(Analysis)
        .filter(Analysis.user_id == user_id)
        .order_by(Analysis.created_at.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )


def get_analysis_by_id(db: Session, analysis_id: int) -> Analysis | None:
    """
    Retrieve a single analysis record by ID.
    
    Args:
        db: Database session
        analysis_id: ID of the analysis record
        
    Returns:
        Analysis object if found, None otherwise
    """
    return db.query(Analysis).filter(Analysis.id == analysis_id).first()


def delete_analysis(db: Session, analysis_id: int) -> bool:
    """
    Delete an analysis record.
    
    Args:
        db: Database session
        analysis_id: ID of the analysis record to delete
        
    Returns:
        True if deleted successfully, False if not found
    """
    db_analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if db_analysis:
        db.delete(db_analysis)
        db.commit()
        return True
    return False
