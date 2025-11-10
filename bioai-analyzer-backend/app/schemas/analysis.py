from pydantic import BaseModel, Field, field_validator
from typing import Dict, List, Any, Optional, Literal
from datetime import datetime


class AnalysisRequest(BaseModel):
    """Schema for sequence analysis request."""
    sequence: str = Field(..., min_length=5, max_length=100000)
    sequence_type: Literal["DNA", "RNA", "Protein"]
    
    @field_validator('sequence')
    @classmethod
    def validate_sequence_length_by_type(cls, v, info):
        """Validate sequence length based on type."""
        # This validator runs after the Field validation
        # Additional validation for protein sequences
        if info.data.get('sequence_type') == 'Protein' and len(v) > 50000:
            raise ValueError('Protein sequences must not exceed 50000 amino acids')
        return v


class NucleotideAnalysisResult(BaseModel):
    """Schema for DNA/RNA analysis results."""
    sequence_type: str
    sequence_length: int
    gc_content: str
    nucleotide_counts: Dict[str, int]
    protein_sequence: Optional[str] = None
    orfs: Optional[List[Dict[str, Any]]] = None


class ProteinAnalysisResult(BaseModel):
    """Schema for protein analysis results."""
    sequence_type: str
    sequence_length: int
    molecular_weight: str
    amino_acid_counts: Dict[str, int]
    isoelectric_point: str


class AnalysisHistoryResponse(BaseModel):
    """Schema for analysis history record."""
    id: int
    sequence_type: str
    input_sequence: str
    results: Dict[str, Any]
    created_at: datetime
    
    class Config:
        from_attributes = True
