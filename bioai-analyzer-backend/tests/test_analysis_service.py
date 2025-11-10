"""
Unit tests for the analysis service.
"""
import pytest
from fastapi import HTTPException
from app.services.analysis_service import AnalysisService


class TestDNAAnalysis:
    """Tests for DNA sequence analysis."""
    
    def test_analyze_dna_valid_sequence(self):
        """Test DNA analysis with valid sequence."""
        service = AnalysisService()
        result = service.analyze_dna("ATGCATGC")
        
        assert result.sequence_type == "DNA"
        assert result.sequence_length == 8
        assert result.gc_content == "50.00"
        assert result.nucleotide_counts == {"A": 2, "T": 2, "G": 2, "C": 2}
        assert result.protein_sequence is not None
    
    def test_analyze_dna_with_whitespace(self):
        """Test DNA analysis cleans whitespace."""
        service = AnalysisService()
        result = service.analyze_dna("ATG CAT GC\n")
        
        assert result.sequence_length == 8
        assert result.sequence_type == "DNA"
    
    def test_analyze_dna_invalid_characters(self):
        """Test DNA analysis rejects invalid characters."""
        service = AnalysisService()
        
        with pytest.raises(HTTPException) as exc_info:
            service.analyze_dna("ATGCX")
        
        assert exc_info.value.status_code == 400
        assert "invalid characters" in exc_info.value.detail.lower()
    
    def test_calculate_gc_content(self):
        """Test GC content calculation."""
        service = AnalysisService()
        
        # 100% GC
        result = service.analyze_dna("GCGCGC")
        assert result.gc_content == "100.00"
        
        # 0% GC
        result = service.analyze_dna("ATATAT")
        assert result.gc_content == "0.00"
    
    def test_find_orfs(self):
        """Test ORF finding with minimum length."""
        service = AnalysisService()
        
        # Create a sequence with an ORF longer than 100bp
        # ATG (start) + 33 codons + TAA (stop) = 105 nucleotides
        orf_sequence = "ATG" + "GCA" * 33 + "TAA"
        result = service.analyze_dna(orf_sequence)
        
        assert len(result.orfs) > 0
        assert result.orfs[0]['start'] == 0
        assert result.orfs[0]['end'] == 105


class TestRNAAnalysis:
    """Tests for RNA sequence analysis."""
    
    def test_analyze_rna_valid_sequence(self):
        """Test RNA analysis with valid sequence."""
        service = AnalysisService()
        result = service.analyze_rna("AUGCAUGC")
        
        assert result.sequence_type == "RNA"
        assert result.sequence_length == 8
        assert result.gc_content == "50.00"
        assert result.nucleotide_counts == {"A": 2, "U": 2, "G": 2, "C": 2}
        assert result.protein_sequence is not None
    
    def test_analyze_rna_invalid_characters(self):
        """Test RNA analysis rejects invalid characters."""
        service = AnalysisService()
        
        with pytest.raises(HTTPException) as exc_info:
            service.analyze_rna("AUGCX")
        
        assert exc_info.value.status_code == 400
        assert "invalid characters" in exc_info.value.detail.lower()
    
    def test_analyze_rna_translation(self):
        """Test RNA translation to protein."""
        service = AnalysisService()
        result = service.analyze_rna("AUGGGCUAA")
        
        assert result.protein_sequence is not None
        assert len(result.protein_sequence) > 0


class TestProteinAnalysis:
    """Tests for protein sequence analysis."""
    
    def test_analyze_protein_valid_sequence(self):
        """Test protein analysis with valid sequence."""
        service = AnalysisService()
        result = service.analyze_protein("ACDEFGHIKLMNPQRSTVWY")
        
        assert result.sequence_type == "Protein"
        assert result.sequence_length == 20
        assert result.molecular_weight is not None
        assert result.isoelectric_point is not None
        assert len(result.amino_acid_counts) == 20
    
    def test_analyze_protein_amino_acid_counts(self):
        """Test amino acid counting."""
        service = AnalysisService()
        result = service.analyze_protein("AAACCC")
        
        assert result.amino_acid_counts["A"] == 3
        assert result.amino_acid_counts["C"] == 3
        assert result.sequence_length == 6
    
    def test_analyze_protein_invalid_characters(self):
        """Test protein analysis rejects invalid characters."""
        service = AnalysisService()
        
        with pytest.raises(HTTPException) as exc_info:
            service.analyze_protein("ACDEFX")
        
        assert exc_info.value.status_code == 400
        assert "invalid characters" in exc_info.value.detail.lower()


class TestSequenceValidation:
    """Tests for sequence validation functions."""
    
    def test_clean_sequence(self):
        """Test sequence cleaning removes whitespace and converts to uppercase."""
        service = AnalysisService()
        
        cleaned = service._clean_sequence("atg cat gc\n\r\t")
        assert cleaned == "ATGCATGC"
    
    def test_validate_dna_sequence_valid(self):
        """Test DNA validation accepts valid sequences."""
        service = AnalysisService()
        
        # Should not raise exception
        service._validate_dna_sequence("ATGC")
    
    def test_validate_rna_sequence_valid(self):
        """Test RNA validation accepts valid sequences."""
        service = AnalysisService()
        
        # Should not raise exception
        service._validate_rna_sequence("AUGC")
    
    def test_validate_protein_sequence_valid(self):
        """Test protein validation accepts valid sequences."""
        service = AnalysisService()
        
        # Should not raise exception
        service._validate_protein_sequence("ACDEFGHIKLMNPQRSTVWY")
