"""
File parsing service for handling FASTA and GenBank format files.
"""
from typing import Tuple
from io import StringIO
from fastapi import HTTPException
from Bio import SeqIO


class FileService:
    """Service for parsing biological sequence files."""
    
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB in bytes
    
    def parse_file(self, file_content: bytes, filename: str) -> Tuple[str, str]:
        """
        Parse FASTA or GenBank file and extract sequence.
        
        Args:
            file_content: Raw file content as bytes
            filename: Name of the uploaded file
            
        Returns:
            Tuple of (sequence, sequence_type)
            
        Raises:
            HTTPException: If file is invalid, too large, or cannot be parsed
        """
        # Validate file size
        if len(file_content) > self.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File size exceeds maximum limit of 10MB"
            )
        
        # Detect file format from extension
        file_format = self._detect_format(filename)
        
        # Parse file and extract sequence
        try:
            content_str = file_content.decode('utf-8')
            handle = StringIO(content_str)
            
            # Read first sequence from file
            record = next(SeqIO.parse(handle, file_format))
            sequence = str(record.seq)
            
            # Auto-detect sequence type
            sequence_type = self._detect_sequence_type(sequence)
            
            return sequence, sequence_type
            
        except StopIteration:
            raise HTTPException(
                status_code=400,
                detail="File contains no valid sequences"
            )
        except UnicodeDecodeError:
            raise HTTPException(
                status_code=400,
                detail="File encoding is not valid UTF-8"
            )
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to parse file: {str(e)}"
            )
    
    def _detect_format(self, filename: str) -> str:
        """
        Detect file format from extension.
        
        Args:
            filename: Name of the file
            
        Returns:
            Format string for Biopython SeqIO ('fasta' or 'genbank')
            
        Raises:
            HTTPException: If file format is not supported
        """
        filename_lower = filename.lower()
        
        if filename_lower.endswith(('.fasta', '.fa')):
            return 'fasta'
        elif filename_lower.endswith(('.gb', '.gbk')):
            return 'genbank'
        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file format"
            )
    
    def _detect_sequence_type(self, sequence: str) -> str:
        """
        Auto-detect if sequence is DNA, RNA, or Protein.
        
        Args:
            sequence: The biological sequence string
            
        Returns:
            Sequence type: "DNA", "RNA", or "Protein"
        """
        seq_upper = sequence.upper()
        
        # Check for protein-specific amino acids (not found in DNA/RNA)
        protein_chars = set('EFILPQZ')
        if any(char in seq_upper for char in protein_chars):
            return "Protein"
        
        # Check for RNA (contains U instead of T)
        if 'U' in seq_upper:
            return "RNA"
        
        # Default to DNA
        return "DNA"
