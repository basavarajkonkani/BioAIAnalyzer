"""
Analysis routes for sequence analysis and file upload.
"""
from fastapi import APIRouter, Depends, status, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import Union

from app.database import get_db
from app.schemas.analysis import (
    AnalysisRequest,
    NucleotideAnalysisResult,
    ProteinAnalysisResult
)
from app.services.analysis_service import AnalysisService
from app.services.file_service import FileService
from app.crud import analysis as crud_analysis
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(tags=["analysis"])


@router.post(
    "/analyze",
    response_model=Union[NucleotideAnalysisResult, ProteinAnalysisResult],
    status_code=status.HTTP_200_OK
)
async def analyze_sequence(
    request: AnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze a biological sequence (DNA, RNA, or Protein).
    
    Routes the sequence to the appropriate analysis method based on sequence_type.
    Saves the analysis results to the database and returns the results.
    
    Args:
        request: Analysis request with sequence and sequence_type
        current_user: Authenticated user (from JWT token)
        db: Database session dependency
        
    Returns:
        NucleotideAnalysisResult for DNA/RNA or ProteinAnalysisResult for Protein
        
    Raises:
        HTTPException 400: If sequence is invalid
        HTTPException 401: If user is not authenticated
        HTTPException 422: If validation fails
    """
    analysis_service = AnalysisService()
    
    # Route to appropriate analysis method based on sequence type
    if request.sequence_type == "DNA":
        result = analysis_service.analyze_dna(request.sequence)
    elif request.sequence_type == "RNA":
        result = analysis_service.analyze_rna(request.sequence)
    elif request.sequence_type == "Protein":
        result = analysis_service.analyze_protein(request.sequence)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid sequence type: {request.sequence_type}"
        )
    
    # Save analysis results to database
    crud_analysis.create_analysis(
        db=db,
        user_id=current_user.id,
        request=request,
        results=result.model_dump()
    )
    
    return result


@router.post(
    "/upload",
    response_model=Union[NucleotideAnalysisResult, ProteinAnalysisResult],
    status_code=status.HTTP_200_OK
)
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload and analyze a biological sequence file (FASTA or GenBank format).
    
    Accepts multipart/form-data file upload, parses the file to extract the sequence,
    auto-detects the sequence type, performs analysis, and saves results to database.
    
    Args:
        file: Uploaded file (FASTA or GenBank format)
        current_user: Authenticated user (from JWT token)
        db: Database session dependency
        
    Returns:
        NucleotideAnalysisResult for DNA/RNA or ProteinAnalysisResult for Protein
        
    Raises:
        HTTPException 400: If file format is invalid or cannot be parsed
        HTTPException 401: If user is not authenticated
        HTTPException 413: If file size exceeds 10MB limit
    """
    # Read file content
    file_content = await file.read()
    
    # Parse file and extract sequence
    file_service = FileService()
    sequence, sequence_type = file_service.parse_file(file_content, file.filename)
    
    # Create analysis request
    request = AnalysisRequest(
        sequence=sequence,
        sequence_type=sequence_type
    )
    
    # Perform analysis using AnalysisService
    analysis_service = AnalysisService()
    
    if sequence_type == "DNA":
        result = analysis_service.analyze_dna(sequence)
    elif sequence_type == "RNA":
        result = analysis_service.analyze_rna(sequence)
    elif sequence_type == "Protein":
        result = analysis_service.analyze_protein(sequence)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid sequence type detected: {sequence_type}"
        )
    
    # Save analysis results to database
    crud_analysis.create_analysis(
        db=db,
        user_id=current_user.id,
        request=request,
        results=result.model_dump()
    )
    
    return result
