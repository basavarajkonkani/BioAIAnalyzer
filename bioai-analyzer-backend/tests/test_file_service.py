"""
Unit tests for the file service.
"""
import pytest
from fastapi import HTTPException
from app.services.file_service import FileService


class TestFASTAParsing:
    """Tests for FASTA file parsing."""
    
    def test_parse_fasta_file_dna(self):
        """Test parsing valid FASTA file with DNA sequence."""
        service = FileService()
        
        fasta_content = b""">seq1 DNA sequence
ATGCATGCATGC
GCATGCATGCAT
"""
        
        sequence, sequence_type = service.parse_file(fasta_content, "test.fasta")
        
        assert sequence == "ATGCATGCATGCGCATGCATGCAT"
        assert sequence_type == "DNA"
    
    def test_parse_fasta_file_rna(self):
        """Test parsing valid FASTA file with RNA sequence."""
        service = FileService()
        
        fasta_content = b""">seq1 RNA sequence
AUGCAUGCAUGC
"""
        
        sequence, sequence_type = service.parse_file(fasta_content, "test.fa")
        
        assert sequence == "AUGCAUGCAUGC"
        assert sequence_type == "RNA"
    
    def test_parse_fasta_file_protein(self):
        """Test parsing valid FASTA file with protein sequence."""
        service = FileService()
        
        fasta_content = b""">seq1 Protein sequence
ACDEFGHIKLMNPQRSTVWY
"""
        
        sequence, sequence_type = service.parse_file(fasta_content, "test.fasta")
        
        assert sequence == "ACDEFGHIKLMNPQRSTVWY"
        assert sequence_type == "Protein"
    
    def test_parse_fasta_multiple_sequences(self):
        """Test parsing FASTA file with multiple sequences returns first."""
        service = FileService()
        
        fasta_content = b""">seq1
ATGCATGC
>seq2
GCATGCAT
"""
        
        sequence, sequence_type = service.parse_file(fasta_content, "test.fasta")
        
        # Should return only the first sequence
        assert sequence == "ATGCATGC"
        assert sequence_type == "DNA"


class TestGenBankParsing:
    """Tests for GenBank file parsing."""
    
    def test_parse_genbank_file(self):
        """Test parsing valid GenBank file."""
        service = FileService()
        
        # Minimal GenBank format
        genbank_content = b"""LOCUS       TEST                      12 bp    DNA     linear   UNK 
DEFINITION  Test sequence
ACCESSION   TEST
VERSION     TEST
KEYWORDS    .
SOURCE      .
  ORGANISM  .
            .
FEATURES             Location/Qualifiers
ORIGIN      
        1 atgcatgcat gc
//
"""
        
        sequence, sequence_type = service.parse_file(genbank_content, "test.gb")
        
        assert sequence == "ATGCATGCATGC"
        assert sequence_type == "DNA"
    
    def test_parse_genbank_file_gbk_extension(self):
        """Test parsing GenBank file with .gbk extension."""
        service = FileService()
        
        genbank_content = b"""LOCUS       TEST                       6 bp    DNA     linear   UNK 
DEFINITION  Test sequence
ACCESSION   TEST
VERSION     TEST
KEYWORDS    .
SOURCE      .
  ORGANISM  .
            .
FEATURES             Location/Qualifiers
ORIGIN      
        1 atgcat
//
"""
        
        sequence, sequence_type = service.parse_file(genbank_content, "test.gbk")
        
        assert sequence == "ATGCAT"
        assert sequence_type == "DNA"


class TestFileFormatDetection:
    """Tests for file format detection."""
    
    def test_detect_format_fasta(self):
        """Test detection of FASTA format."""
        service = FileService()
        
        assert service._detect_format("test.fasta") == "fasta"
        assert service._detect_format("test.fa") == "fasta"
        assert service._detect_format("TEST.FASTA") == "fasta"
        assert service._detect_format("TEST.FA") == "fasta"
    
    def test_detect_format_genbank(self):
        """Test detection of GenBank format."""
        service = FileService()
        
        assert service._detect_format("test.gb") == "genbank"
        assert service._detect_format("test.gbk") == "genbank"
        assert service._detect_format("TEST.GB") == "genbank"
        assert service._detect_format("TEST.GBK") == "genbank"
    
    def test_detect_format_unsupported(self):
        """Test detection rejects unsupported formats."""
        service = FileService()
        
        with pytest.raises(HTTPException) as exc_info:
            service._detect_format("test.txt")
        
        assert exc_info.value.status_code == 400
        assert "unsupported file format" in exc_info.value.detail.lower()
    
    def test_detect_format_no_extension(self):
        """Test detection rejects files without extension."""
        service = FileService()
        
        with pytest.raises(HTTPException) as exc_info:
            service._detect_format("testfile")
        
        assert exc_info.value.status_code == 400


class TestSequenceTypeDetection:
    """Tests for sequence type auto-detection."""
    
    def test_detect_sequence_type_dna(self):
        """Test detection of DNA sequences."""
        service = FileService()
        
        assert service._detect_sequence_type("ATGCATGC") == "DNA"
        assert service._detect_sequence_type("atgcatgc") == "DNA"
        assert service._detect_sequence_type("AAATTTGGGCCC") == "DNA"
    
    def test_detect_sequence_type_rna(self):
        """Test detection of RNA sequences."""
        service = FileService()
        
        assert service._detect_sequence_type("AUGCAUGC") == "RNA"
        assert service._detect_sequence_type("augcaugc") == "RNA"
        assert service._detect_sequence_type("AAAUUUGGGCCC") == "RNA"
    
    def test_detect_sequence_type_protein(self):
        """Test detection of protein sequences."""
        service = FileService()
        
        # Sequences with protein-specific amino acids
        assert service._detect_sequence_type("ACDEFGHIKLMNPQRSTVWY") == "Protein"
        assert service._detect_sequence_type("MEQPFIL") == "Protein"
        assert service._detect_sequence_type("acdefghiklmnpqrstvwy") == "Protein"
    
    def test_detect_sequence_type_ambiguous(self):
        """Test detection defaults to DNA for ambiguous sequences."""
        service = FileService()
        
        # Sequence with only A, G, C (could be DNA or RNA)
        assert service._detect_sequence_type("AGCAGC") == "DNA"


class TestFileValidation:
    """Tests for file validation."""
    
    def test_file_size_limit(self):
        """Test file size validation."""
        service = FileService()
        
        # Create content larger than 10MB
        large_content = b"A" * (11 * 1024 * 1024)
        
        with pytest.raises(HTTPException) as exc_info:
            service.parse_file(large_content, "test.fasta")
        
        assert exc_info.value.status_code == 413
        assert "10mb" in exc_info.value.detail.lower()
    
    def test_empty_file(self):
        """Test parsing empty file."""
        service = FileService()
        
        empty_content = b""
        
        with pytest.raises(HTTPException) as exc_info:
            service.parse_file(empty_content, "test.fasta")
        
        assert exc_info.value.status_code == 400
    
    def test_invalid_fasta_format(self):
        """Test parsing invalid FASTA content."""
        service = FileService()
        
        invalid_content = b"This is not a valid FASTA file"
        
        with pytest.raises(HTTPException) as exc_info:
            service.parse_file(invalid_content, "test.fasta")
        
        assert exc_info.value.status_code == 400
    
    def test_invalid_encoding(self):
        """Test parsing file with invalid UTF-8 encoding."""
        service = FileService()
        
        # Create invalid UTF-8 bytes
        invalid_content = b"\xff\xfe\xfd"
        
        with pytest.raises(HTTPException) as exc_info:
            service.parse_file(invalid_content, "test.fasta")
        
        assert exc_info.value.status_code == 400
        assert "encoding" in exc_info.value.detail.lower()
    
    def test_no_sequences_in_file(self):
        """Test parsing file with no valid sequences."""
        service = FileService()
        
        # FASTA file with header but no sequence
        no_seq_content = b">seq1\n"
        
        with pytest.raises(HTTPException) as exc_info:
            service.parse_file(no_seq_content, "test.fasta")
        
        assert exc_info.value.status_code == 400
        assert "no valid sequences" in exc_info.value.detail.lower()

