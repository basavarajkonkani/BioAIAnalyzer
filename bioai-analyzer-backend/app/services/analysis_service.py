"""
Analysis service for processing biological sequences.
"""
from typing import List, Dict, Any
from fastapi import HTTPException
from Bio.Seq import Seq
from Bio.SeqUtils import gc_fraction
from Bio.SeqUtils.ProtParam import ProteinAnalysis
from app.schemas.analysis import NucleotideAnalysisResult, ProteinAnalysisResult


class AnalysisService:
    """Service for analyzing DNA, RNA, and protein sequences using Biopython."""
    
    def analyze_dna(self, sequence: str) -> NucleotideAnalysisResult:
        """
        Analyze DNA sequence using Biopython.
        Returns GC content, nucleotide counts, protein translation, and ORFs.
        
        Args:
            sequence: DNA sequence string
            
        Returns:
            NucleotideAnalysisResult with analysis data
            
        Raises:
            HTTPException: If sequence contains invalid characters
        """
        # Clean and validate sequence
        seq = self._clean_sequence(sequence)
        self._validate_dna_sequence(seq)
        
        # Create Biopython Seq object
        bio_seq = Seq(seq)
        
        # Calculate GC content
        gc_content = self._calculate_gc_content(bio_seq)
        
        # Count nucleotides
        nucleotide_counts = {
            'A': seq.count('A'),
            'T': seq.count('T'),
            'G': seq.count('G'),
            'C': seq.count('C')
        }
        
        # Translate to protein
        protein_seq = str(bio_seq.translate(to_stop=False))
        
        # Find ORFs
        orfs = self._find_orfs(bio_seq, min_length=100)
        
        return NucleotideAnalysisResult(
            sequence_type="DNA",
            sequence_length=len(seq),
            gc_content=f"{gc_content:.2f}",
            nucleotide_counts=nucleotide_counts,
            protein_sequence=protein_seq,
            orfs=orfs
        )
    
    def _clean_sequence(self, sequence: str) -> str:
        """
        Remove whitespace and convert to uppercase.
        
        Args:
            sequence: Raw sequence string
            
        Returns:
            Cleaned sequence string
        """
        return sequence.replace(" ", "").replace("\n", "").replace("\r", "").replace("\t", "").upper()
    
    def _validate_dna_sequence(self, sequence: str) -> None:
        """
        Validate DNA sequence contains only A, T, G, C.
        
        Args:
            sequence: DNA sequence string
            
        Raises:
            HTTPException: If sequence contains invalid characters
        """
        valid_chars = set('ATGC')
        if not set(sequence).issubset(valid_chars):
            raise HTTPException(
                status_code=400,
                detail="Invalid DNA sequence: contains invalid characters"
            )
    
    def _calculate_gc_content(self, bio_seq: Seq) -> float:
        """
        Calculate GC content percentage.
        
        Args:
            bio_seq: Biopython Seq object
            
        Returns:
            GC content as percentage (0-100)
        """
        return gc_fraction(bio_seq) * 100
    
    def _find_orfs(self, bio_seq: Seq, min_length: int = 100) -> List[Dict[str, Any]]:
        """
        Find Open Reading Frames in DNA sequence.
        
        Args:
            bio_seq: Biopython Seq object
            min_length: Minimum ORF length in nucleotides
            
        Returns:
            List of ORF dictionaries with start, end, and sequence
        """
        orfs = []
        seq_str = str(bio_seq)
        
        # Search in all three reading frames
        for frame in range(3):
            for i in range(frame, len(seq_str) - 2, 3):
                codon = seq_str[i:i+3]
                if codon == 'ATG':  # Start codon
                    # Find stop codon
                    for j in range(i+3, len(seq_str) - 2, 3):
                        stop_codon = seq_str[j:j+3]
                        if stop_codon in ['TAA', 'TAG', 'TGA']:
                            orf_length = j + 3 - i
                            if orf_length >= min_length:
                                orfs.append({
                                    'start': i,
                                    'end': j + 3,
                                    'sequence': seq_str[i:j+3]
                                })
                            break
        
        return orfs
    
    def analyze_rna(self, sequence: str) -> NucleotideAnalysisResult:
        """
        Analyze RNA sequence using Biopython.
        Returns GC content, nucleotide counts, and protein translation.
        
        Args:
            sequence: RNA sequence string
            
        Returns:
            NucleotideAnalysisResult with analysis data
            
        Raises:
            HTTPException: If sequence contains invalid characters
        """
        # Clean and validate sequence
        seq = self._clean_sequence(sequence)
        self._validate_rna_sequence(seq)
        
        # Create Biopython Seq object
        bio_seq = Seq(seq)
        
        # Calculate GC content
        gc_content = self._calculate_gc_content(bio_seq)
        
        # Count nucleotides
        nucleotide_counts = {
            'A': seq.count('A'),
            'U': seq.count('U'),
            'G': seq.count('G'),
            'C': seq.count('C')
        }
        
        # Translate to protein
        protein_seq = str(bio_seq.translate(to_stop=False))
        
        return NucleotideAnalysisResult(
            sequence_type="RNA",
            sequence_length=len(seq),
            gc_content=f"{gc_content:.2f}",
            nucleotide_counts=nucleotide_counts,
            protein_sequence=protein_seq
        )
    
    def _validate_rna_sequence(self, sequence: str) -> None:
        """
        Validate RNA sequence contains only A, U, G, C.
        
        Args:
            sequence: RNA sequence string
            
        Raises:
            HTTPException: If sequence contains invalid characters
        """
        valid_chars = set('AUGC')
        if not set(sequence).issubset(valid_chars):
            raise HTTPException(
                status_code=400,
                detail="Invalid RNA sequence: contains invalid characters"
            )
    
    def analyze_protein(self, sequence: str) -> ProteinAnalysisResult:
        """
        Analyze protein sequence using Biopython ProteinAnalysis.
        Returns molecular weight, amino acid counts, and isoelectric point.
        
        Args:
            sequence: Protein sequence string
            
        Returns:
            ProteinAnalysisResult with analysis data
            
        Raises:
            HTTPException: If sequence contains invalid characters
        """
        # Clean and validate sequence
        seq = self._clean_sequence(sequence)
        self._validate_protein_sequence(seq)
        
        # Create Biopython ProteinAnalysis object
        protein_analysis = ProteinAnalysis(seq)
        
        # Calculate properties
        molecular_weight = protein_analysis.molecular_weight()
        isoelectric_point = protein_analysis.isoelectric_point()
        
        # Get amino acid counts (returns percentages, we need counts)
        amino_acid_counts = {}
        for aa in 'ACDEFGHIKLMNPQRSTVWY':
            count = seq.count(aa)
            if count > 0:
                amino_acid_counts[aa] = count
        
        return ProteinAnalysisResult(
            sequence_type="Protein",
            sequence_length=len(seq),
            molecular_weight=f"{molecular_weight:.2f}",
            amino_acid_counts=amino_acid_counts,
            isoelectric_point=f"{isoelectric_point:.2f}"
        )
    
    def _validate_protein_sequence(self, sequence: str) -> None:
        """
        Validate protein sequence contains only valid amino acid codes.
        
        Args:
            sequence: Protein sequence string
            
        Raises:
            HTTPException: If sequence contains invalid characters
        """
        valid_chars = set('ACDEFGHIKLMNPQRSTVWY')
        if not set(sequence).issubset(valid_chars):
            raise HTTPException(
                status_code=400,
                detail="Invalid protein sequence: contains invalid characters"
            )
