"""
Integration tests for analysis endpoints.
Tests /analyze and /upload endpoints with authentication.
"""
import pytest
from io import BytesIO


def test_analyze_dna_authenticated(client, auth_headers):
    """Test DNA sequence analysis with valid authentication."""
    response = client.post("/analyze", 
        headers=auth_headers,
        json={
            "sequence": "ATGCATGCATGC",
            "sequence_type": "DNA"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["sequence_type"] == "DNA"
    assert data["sequence_length"] == 12
    assert "gc_content" in data
    assert "nucleotide_counts" in data
    assert "protein_sequence" in data
    assert "orfs" in data


def test_analyze_rna_authenticated(client, auth_headers):
    """Test RNA sequence analysis with valid authentication."""
    response = client.post("/analyze",
        headers=auth_headers,
        json={
            "sequence": "AUGCAUGCAUGC",
            "sequence_type": "RNA"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["sequence_type"] == "RNA"
    assert data["sequence_length"] == 12
    assert "gc_content" in data
    assert "nucleotide_counts" in data
    assert "protein_sequence" in data


def test_analyze_protein_authenticated(client, auth_headers):
    """Test protein sequence analysis with valid authentication."""
    response = client.post("/analyze",
        headers=auth_headers,
        json={
            "sequence": "MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQFEVVHSLAKWKRQTLGQHDFSAGEGLYTHMKALRPDEDRLSPLHSVYVDQWDWERVMGDGERQFSTLKSTVEAIWAGIKATEAAVSEEFGLAPFLPDQIHFVHSQELLSRYPDLDAKGRERAIAKDLGAVFLVGIGGKLSDGHRHDVRAPDYDDWSTPSELGHAGLNGDILVWNPVLEDAFELSSMGIRVDADTLKHQLALTGDEDRLELEWHQALLRGEMPQTIGGGIGQSRLTMLLLQLPHIGQVQAGVWPAAVRESVPSLL",
            "sequence_type": "Protein"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["sequence_type"] == "Protein"
    assert data["sequence_length"] > 0
    assert "molecular_weight" in data
    assert "amino_acid_counts" in data
    assert "isoelectric_point" in data


def test_analyze_unauthorized(client):
    """Test analysis without authentication returns 401."""
    response = client.post("/analyze", json={
        "sequence": "ATGCATGC",
        "sequence_type": "DNA"
    })
    
    assert response.status_code == 401


def test_analyze_invalid_dna_sequence(client, auth_headers):
    """Test analysis with invalid DNA sequence characters."""
    response = client.post("/analyze",
        headers=auth_headers,
        json={
            "sequence": "ATGCXYZ",
            "sequence_type": "DNA"
        }
    )
    
    assert response.status_code == 400
    assert "invalid" in response.json()["detail"].lower()


def test_analyze_invalid_rna_sequence(client, auth_headers):
    """Test analysis with invalid RNA sequence characters."""
    response = client.post("/analyze",
        headers=auth_headers,
        json={
            "sequence": "AUGCXYZ",
            "sequence_type": "RNA"
        }
    )
    
    assert response.status_code == 400
    assert "invalid" in response.json()["detail"].lower()


def test_analyze_invalid_protein_sequence(client, auth_headers):
    """Test analysis with invalid protein sequence characters."""
    response = client.post("/analyze",
        headers=auth_headers,
        json={
            "sequence": "MKTXYZ123",
            "sequence_type": "Protein"
        }
    )
    
    assert response.status_code == 400
    assert "invalid" in response.json()["detail"].lower()


def test_analyze_sequence_too_short(client, auth_headers):
    """Test analysis with sequence below minimum length."""
    response = client.post("/analyze",
        headers=auth_headers,
        json={
            "sequence": "ATG",
            "sequence_type": "DNA"
        }
    )
    
    assert response.status_code == 422


def test_upload_fasta_file(client, auth_headers):
    """Test file upload with FASTA format."""
    fasta_content = b">test_sequence\nATGCATGCATGCATGCATGC\n"
    
    response = client.post("/upload",
        headers=auth_headers,
        files={"file": ("test.fasta", BytesIO(fasta_content), "text/plain")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "sequence_type" in data
    assert "sequence_length" in data


def test_upload_genbank_file(client, auth_headers):
    """Test file upload with GenBank format."""
    genbank_content = b"""LOCUS       test_seq                  20 bp    DNA     linear   UNK 
DEFINITION  Test sequence
ACCESSION   test_seq
VERSION     test_seq
KEYWORDS    .
SOURCE      .
  ORGANISM  .
            .
FEATURES             Location/Qualifiers
ORIGIN      
        1 atgcatgcat gcatgcatgc
//
"""
    
    response = client.post("/upload",
        headers=auth_headers,
        files={"file": ("test.gb", BytesIO(genbank_content), "text/plain")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "sequence_type" in data
    assert "sequence_length" in data


def test_upload_unauthorized(client):
    """Test file upload without authentication returns 401."""
    fasta_content = b">test\nATGC\n"
    
    response = client.post("/upload",
        files={"file": ("test.fasta", BytesIO(fasta_content), "text/plain")}
    )
    
    assert response.status_code == 401


def test_upload_unsupported_format(client, auth_headers):
    """Test file upload with unsupported file format."""
    response = client.post("/upload",
        headers=auth_headers,
        files={"file": ("test.txt", BytesIO(b"ATGC"), "text/plain")}
    )
    
    assert response.status_code == 400
    assert "unsupported" in response.json()["detail"].lower()
