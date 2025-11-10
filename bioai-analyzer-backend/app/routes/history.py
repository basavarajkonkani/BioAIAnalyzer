"""
History routes for retrieving and managing analysis history.
"""
from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.analysis import AnalysisHistoryResponse
from app.crud import analysis as crud_analysis
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/history", tags=["history"])


@router.get(
    "",
    response_model=List[AnalysisHistoryResponse],
    status_code=status.HTTP_200_OK
)
async def get_history(
    limit: int = Query(default=100, le=100, ge=1),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve analysis history for the authenticated user.
    
    Returns a paginated list of analysis records ordered by creation date (newest first).
    Maximum of 100 records per request.
    
    Args:
        limit: Maximum number of records to return (1-100, default: 100)
        offset: Number of records to skip for pagination (default: 0)
        current_user: Authenticated user (from JWT token)
        db: Database session dependency
        
    Returns:
        List[AnalysisHistoryResponse]: List of analysis history records
        
    Raises:
        HTTPException 401: If user is not authenticated
        HTTPException 422: If validation fails
    """
    analyses = crud_analysis.get_user_analyses(
        db=db,
        user_id=current_user.id,
        limit=limit,
        offset=offset
    )
    
    return analyses


@router.get(
    "/{id}",
    response_model=AnalysisHistoryResponse,
    status_code=status.HTTP_200_OK
)
async def get_single_analysis(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve a single analysis record by ID.
    
    Returns the complete analysis record if it belongs to the authenticated user.
    
    Args:
        id: Analysis record ID
        current_user: Authenticated user (from JWT token)
        db: Database session dependency
        
    Returns:
        AnalysisHistoryResponse: Complete analysis record
        
    Raises:
        HTTPException 401: If user is not authenticated
        HTTPException 403: If analysis does not belong to the authenticated user
        HTTPException 404: If analysis record is not found
    """
    # Retrieve analysis record
    analysis = crud_analysis.get_analysis_by_id(db, id)
    
    # Check if analysis exists
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis record not found"
        )
    
    # Verify analysis belongs to authenticated user
    if analysis.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return analysis


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_analysis(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete an analysis record.
    
    Deletes the analysis record if it belongs to the authenticated user.
    
    Args:
        id: Analysis record ID to delete
        current_user: Authenticated user (from JWT token)
        db: Database session dependency
        
    Returns:
        None (204 No Content on success)
        
    Raises:
        HTTPException 401: If user is not authenticated
        HTTPException 403: If analysis does not belong to the authenticated user
        HTTPException 404: If analysis record is not found
    """
    # Retrieve analysis record
    analysis = crud_analysis.get_analysis_by_id(db, id)
    
    # Check if analysis exists
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis record not found"
        )
    
    # Verify analysis belongs to authenticated user
    if analysis.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Delete the analysis
    crud_analysis.delete_analysis(db, id)
    
    return None
