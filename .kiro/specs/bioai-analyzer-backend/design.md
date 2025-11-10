# Design Document

## Overview

The BioAI Analyzer Backend is a RESTful API service built with FastAPI that provides computational biology analysis capabilities. The system follows a layered architecture with clear separation between API routes, business logic, data access, and external services. It uses PostgreSQL for persistent storage, Biopython for sequence analysis, and JWT for stateless authentication. The backend is designed to be scalable, maintainable, and secure.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Application                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  API Layer (Routes)                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │   Auth   │  │ Analysis │  │ History  │           │  │
│  │  │  Routes  │  │  Routes  │  │  Routes  │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Business Logic Layer                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │   Auth   │  │ Analysis │  │ History  │           │  │
│  │  │ Service  │  │ Service  │  │ Service  │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Data Access Layer                         │  │
│  │  ┌──────────┐  ┌──────────┐                          │  │
│  │  │   User   │  │ Analysis │                          │  │
│  │  │   CRUD   │  │   CRUD   │                          │  │
│  │  └──────────┘  └──────────┘                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │   PostgreSQL DB  │
                  └──────────────────┘
```

### Technology Stack

- **FastAPI**: Modern Python web framework with automatic OpenAPI documentation
- **SQLAlchemy**: ORM for database operations
- **Alembic**: Database migration tool
- **PostgreSQL**: Relational database for data persistence
- **Biopython**: Computational biology library for sequence analysis
- **Pydantic**: Data validation and settings management
- **python-jose**: JWT token creation and validation
- **passlib**: Password hashing with bcrypt
- **python-multipart**: File upload handling
- **uvicorn**: ASGI server for running the application

### Project Structure

```
bioai-analyzer-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration and environment variables
│   ├── database.py             # Database connection and session management
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py            # User SQLAlchemy model
│   │   └── analysis.py        # Analysis history SQLAlchemy model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py            # User Pydantic schemas
│   │   ├── auth.py            # Authentication Pydantic schemas
│   │   └── analysis.py        # Analysis Pydantic schemas
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py            # Authentication endpoints
│   │   ├── analysis.py        # Analysis endpoints
│   │   └── history.py         # History endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py    # Authentication business logic
│   │   ├── analysis_service.py # Sequence analysis logic
│   │   └── file_service.py    # File parsing logic
│   ├── crud/
│   │   ├── __init__.py
│   │   ├── user.py            # User database operations
│   │   └── analysis.py        # Analysis database operations
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── security.py        # JWT and password utilities
│   │   └── validators.py      # Input validation utilities
│   └── middleware/
│       ├── __init__.py
│       └── error_handler.py   # Global error handling
├── alembic/
│   ├── versions/              # Database migrations
│   └── env.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_analysis.py
│   └── test_history.py
├── requirements.txt
├── .env.example
├── alembic.ini
└── README.md
```

## Components and Interfaces

### API Routes

#### Authentication Routes (`/auth`)

**POST /auth/register**
- Request Body:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- Response (201):
  ```json
  {
    "id": 1,
    "name": "string",
    "email": "string",
    "created_at": "2024-01-01T00:00:00Z"
  }
  ```
- Errors: 400 (email exists), 422 (validation error)

**POST /auth/login**
- Request Body:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- Response (200):
  ```json
  {
    "access_token": "string",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "name": "string",
      "email": "string"
    }
  }
  ```
- Errors: 401 (invalid credentials), 422 (validation error)

#### Analysis Routes (`/analyze`, `/upload`)

**POST /analyze**
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "sequence": "ATGCATGC",
    "sequence_type": "DNA"
  }
  ```
- Response (200):
  ```json
  {
    "sequence_type": "DNA",
    "sequence_length": 8,
    "gc_content": "50.00",
    "nucleotide_counts": {"A": 2, "T": 2, "G": 2, "C": 2},
    "protein_sequence": "MH",
    "orfs": [
      {"start": 0, "end": 6, "sequence": "ATGCAT"}
    ]
  }
  ```
- Errors: 400 (invalid sequence), 401 (unauthorized), 504 (timeout)

**POST /upload**
- Headers: `Authorization: Bearer <token>`
- Request: multipart/form-data with file field
- Response: Same as /analyze
- Errors: 400 (invalid format), 413 (file too large), 401 (unauthorized)

#### History Routes (`/history`)

**GET /history**
- Headers: `Authorization: Bearer <token>`
- Query Parameters: `limit` (default: 100), `offset` (default: 0)
- Response (200):
  ```json
  [
    {
      "id": 1,
      "sequence_type": "DNA",
      "input_sequence": "ATGC...",
      "results": {...},
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
  ```

**GET /history/{id}**
- Headers: `Authorization: Bearer <token>`
- Response (200): Single analysis record
- Errors: 403 (access denied), 404 (not found)

**DELETE /history/{id}**
- Headers: `Authorization: Bearer <token>`
- Response (204): No content
- Errors: 403 (access denied), 404 (not found)


## Data Models

### Database Models (SQLAlchemy)

#### User Model
```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")
```

#### Analysis Model
```python
class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sequence_type = Column(String(20), nullable=False)  # DNA, RNA, Protein
    input_sequence = Column(Text, nullable=False)
    results = Column(JSON, nullable=False)  # Store analysis results as JSON
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationship
    user = relationship("User", back_populates="analyses")
```

### Pydantic Schemas

#### User Schemas
```python
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str
```

#### Auth Schemas
```python
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    user_id: int
    email: str
```

#### Analysis Schemas
```python
class AnalysisRequest(BaseModel):
    sequence: str = Field(..., min_length=5, max_length=100000)
    sequence_type: Literal["DNA", "RNA", "Protein"]

class NucleotideAnalysisResult(BaseModel):
    sequence_type: str
    sequence_length: int
    gc_content: str
    nucleotide_counts: Dict[str, int]
    protein_sequence: Optional[str] = None
    orfs: Optional[List[Dict[str, Any]]] = None

class ProteinAnalysisResult(BaseModel):
    sequence_type: str
    sequence_length: int
    molecular_weight: str
    amino_acid_counts: Dict[str, int]
    isoelectric_point: str

class AnalysisHistoryResponse(BaseModel):
    id: int
    sequence_type: str
    input_sequence: str
    results: Dict[str, Any]
    created_at: datetime
    
    class Config:
        from_attributes = True
```

## Business Logic Services

### Authentication Service

```python
class AuthService:
    def __init__(self, db: Session):
        self.db = db
    
    def register_user(self, user_data: UserCreate) -> User:
        """
        Register a new user with hashed password.
        Raises HTTPException if email already exists.
        """
        # Check if email exists
        existing_user = crud.get_user_by_email(self.db, user_data.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user
        user = crud.create_user(self.db, user_data, hashed_password)
        return user
    
    def authenticate_user(self, email: str, password: str) -> User:
        """
        Authenticate user credentials.
        Returns User object if valid, raises HTTPException if invalid.
        """
        user = crud.get_user_by_email(self.db, email)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        return user
    
    def create_access_token(self, user: User) -> str:
        """Create JWT access token for authenticated user."""
        data = {"sub": str(user.id), "email": user.email}
        expires = datetime.utcnow() + timedelta(hours=24)
        token = create_jwt_token(data, expires)
        return token
```

### Analysis Service

```python
class AnalysisService:
    def analyze_dna(self, sequence: str) -> NucleotideAnalysisResult:
        """
        Analyze DNA sequence using Biopython.
        Returns GC content, nucleotide counts, protein translation, and ORFs.
        """
        # Clean and validate sequence
        seq = self._clean_sequence(sequence)
        self._validate_dna_sequence(seq)
        
        # Create Biopython Seq object
        from Bio.Seq import Seq
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
    
    def analyze_rna(self, sequence: str) -> NucleotideAnalysisResult:
        """Analyze RNA sequence using Biopython."""
        # Similar to DNA analysis but with U instead of T
        seq = self._clean_sequence(sequence)
        self._validate_rna_sequence(seq)
        
        from Bio.Seq import Seq
        bio_seq = Seq(seq)
        
        gc_content = self._calculate_gc_content(bio_seq)
        
        nucleotide_counts = {
            'A': seq.count('A'),
            'U': seq.count('U'),
            'G': seq.count('G'),
            'C': seq.count('C')
        }
        
        protein_seq = str(bio_seq.translate(to_stop=False))
        
        return NucleotideAnalysisResult(
            sequence_type="RNA",
            sequence_length=len(seq),
            gc_content=f"{gc_content:.2f}",
            nucleotide_counts=nucleotide_counts,
            protein_sequence=protein_seq
        )
    
    def analyze_protein(self, sequence: str) -> ProteinAnalysisResult:
        """Analyze protein sequence using Biopython ProteinAnalysis."""
        seq = self._clean_sequence(sequence)
        self._validate_protein_sequence(seq)
        
        from Bio.SeqUtils.ProtParam import ProteinAnalysis
        protein_analysis = ProteinAnalysis(seq)
        
        # Calculate properties
        molecular_weight = protein_analysis.molecular_weight()
        isoelectric_point = protein_analysis.isoelectric_point()
        amino_acid_counts = protein_analysis.get_amino_acids_percent()
        
        return ProteinAnalysisResult(
            sequence_type="Protein",
            sequence_length=len(seq),
            molecular_weight=f"{molecular_weight:.2f}",
            amino_acid_counts=amino_acid_counts,
            isoelectric_point=f"{isoelectric_point:.2f}"
        )
    
    def _clean_sequence(self, sequence: str) -> str:
        """Remove whitespace and convert to uppercase."""
        return sequence.replace(" ", "").replace("\n", "").replace("\r", "").upper()
    
    def _validate_dna_sequence(self, sequence: str):
        """Validate DNA sequence contains only A, T, G, C."""
        valid_chars = set('ATGC')
        if not set(sequence).issubset(valid_chars):
            raise HTTPException(
                status_code=400,
                detail="Invalid DNA sequence: contains invalid characters"
            )
    
    def _validate_rna_sequence(self, sequence: str):
        """Validate RNA sequence contains only A, U, G, C."""
        valid_chars = set('AUGC')
        if not set(sequence).issubset(valid_chars):
            raise HTTPException(
                status_code=400,
                detail="Invalid RNA sequence: contains invalid characters"
            )
    
    def _validate_protein_sequence(self, sequence: str):
        """Validate protein sequence contains only valid amino acids."""
        valid_chars = set('ACDEFGHIKLMNPQRSTVWY')
        if not set(sequence).issubset(valid_chars):
            raise HTTPException(
                status_code=400,
                detail="Invalid protein sequence: contains invalid characters"
            )
    
    def _calculate_gc_content(self, bio_seq) -> float:
        """Calculate GC content percentage."""
        from Bio.SeqUtils import gc_fraction
        return gc_fraction(bio_seq) * 100
    
    def _find_orfs(self, bio_seq, min_length: int = 100) -> List[Dict]:
        """Find Open Reading Frames in DNA sequence."""
        orfs = []
        seq_str = str(bio_seq)
        
        # Search in all three reading frames
        for frame in range(3):
            for i in range(frame, len(seq_str) - 2, 3):
                codon = seq_str[i:i+3]
                if codon in ['ATG']:  # Start codon
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
```

### File Service

```python
class FileService:
    def parse_file(self, file_content: bytes, filename: str) -> Tuple[str, str]:
        """
        Parse FASTA or GenBank file and extract sequence.
        Returns (sequence, sequence_type).
        """
        from Bio import SeqIO
        from io import StringIO
        
        # Determine file format
        file_format = self._detect_format(filename)
        
        # Parse file
        try:
            content_str = file_content.decode('utf-8')
            handle = StringIO(content_str)
            
            # Read first sequence
            record = next(SeqIO.parse(handle, file_format))
            sequence = str(record.seq)
            
            # Detect sequence type
            sequence_type = self._detect_sequence_type(sequence)
            
            return sequence, sequence_type
            
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to parse file: {str(e)}"
            )
    
    def _detect_format(self, filename: str) -> str:
        """Detect file format from extension."""
        if filename.endswith(('.fasta', '.fa')):
            return 'fasta'
        elif filename.endswith(('.gb', '.gbk')):
            return 'genbank'
        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file format"
            )
    
    def _detect_sequence_type(self, sequence: str) -> str:
        """Auto-detect if sequence is DNA, RNA, or Protein."""
        seq_upper = sequence.upper()
        
        # Check for protein (contains amino acids not in DNA/RNA)
        protein_chars = set('EFILPQZ')
        if any(char in seq_upper for char in protein_chars):
            return "Protein"
        
        # Check for RNA (contains U)
        if 'U' in seq_upper:
            return "RNA"
        
        # Default to DNA
        return "DNA"
```


## Security Implementation

### Password Hashing

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Hash password using bcrypt with cost factor 12."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    return pwd_context.verify(plain_password, hashed_password)
```

### JWT Token Management

```python
from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def create_jwt_token(data: dict, expires_delta: timedelta) -> str:
    """Create JWT token with expiration."""
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_jwt_token(token: str) -> dict:
    """Decode and validate JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Authentication Dependency

```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get current authenticated user from JWT token.
    Used in protected routes.
    """
    token = credentials.credentials
    payload = decode_jwt_token(token)
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = crud.get_user_by_id(db, int(user_id))
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user
```

## Database Configuration

### Connection Setup

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=3600    # Recycle connections after 1 hour
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Database Migrations (Alembic)

Initial migration to create tables:

```python
# alembic/versions/001_initial.py
def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    
    op.create_table(
        'analyses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('sequence_type', sa.String(20), nullable=False),
        sa.Column('input_sequence', sa.Text(), nullable=False),
        sa.Column('results', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_analyses_created_at', 'analyses', ['created_at'])
```

## Error Handling

### Global Exception Handler

```python
from fastapi import Request
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with proper logging."""
    logger.warning(f"HTTP {exc.status_code}: {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )
```

### Request Timeout Middleware

```python
import asyncio
from starlette.middleware.base import BaseHTTPMiddleware

class TimeoutMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            return await asyncio.wait_for(call_next(request), timeout=30.0)
        except asyncio.TimeoutError:
            return JSONResponse(
                status_code=504,
                content={"detail": "Analysis timeout: sequence too complex"}
            )
```

## CORS Configuration

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://bioai.nighan2labs.in",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Configuration Management

### Environment Variables

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24
    
    # Application
    APP_NAME: str = "BioAI Analyzer Backend"
    DEBUG: bool = False
    
    # File Upload
    MAX_FILE_SIZE: int = 10485760  # 10MB
    
    # CORS
    ALLOWED_ORIGINS: list = [
        "https://bioai.nighan2labs.in",
        "http://localhost:5173"
    ]
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### Example .env File

```
DATABASE_URL=postgresql://user:password@localhost:5432/bioai_db
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=False
```

## Testing Strategy

### Unit Tests

Test individual components in isolation:

```python
# tests/test_analysis_service.py
def test_analyze_dna_valid_sequence():
    service = AnalysisService()
    result = service.analyze_dna("ATGCATGC")
    
    assert result.sequence_type == "DNA"
    assert result.sequence_length == 8
    assert result.gc_content == "50.00"
    assert result.nucleotide_counts == {"A": 2, "T": 2, "G": 2, "C": 2}

def test_analyze_dna_invalid_sequence():
    service = AnalysisService()
    
    with pytest.raises(HTTPException) as exc_info:
        service.analyze_dna("ATGCX")
    
    assert exc_info.value.status_code == 400
    assert "invalid characters" in exc_info.value.detail.lower()
```

### Integration Tests

Test API endpoints with database:

```python
# tests/test_auth.py
def test_register_user(client, db):
    response = client.post("/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    })
    
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_login_user(client, db, test_user):
    response = client.post("/auth/login", json={
        "email": test_user.email,
        "password": "password123"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
```

### Test Fixtures

```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

@pytest.fixture
def db():
    """Create test database session."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()

@pytest.fixture
def client(db):
    """Create test client."""
    def override_get_db():
        yield db
    
    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)

@pytest.fixture
def test_user(db):
    """Create test user."""
    user = User(
        name="Test User",
        email="test@example.com",
        hashed_password=get_password_hash("password123")
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
```

## Performance Considerations

### Database Optimization

1. **Indexing**: Create indexes on frequently queried columns (email, created_at)
2. **Connection Pooling**: Use SQLAlchemy connection pool with appropriate size
3. **Query Optimization**: Use eager loading for relationships when needed
4. **Pagination**: Limit query results to prevent memory issues

### Caching Strategy

For future optimization:
- Cache frequently accessed user data using Redis
- Cache analysis results for identical sequences
- Implement rate limiting per user

### Async Operations

FastAPI supports async/await for I/O operations:

```python
@router.post("/analyze")
async def analyze_sequence(
    request: AnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Analysis service can be made async for better concurrency
    result = await analysis_service.analyze(request.sequence, request.sequence_type)
    
    # Save to database asynchronously
    await crud.create_analysis(db, current_user.id, request, result)
    
    return result
```

## Deployment Configuration

### Docker Setup

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/bioai
      - SECRET_KEY=${SECRET_KEY}
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=bioai
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Production Considerations

1. **HTTPS**: Use reverse proxy (Nginx) with SSL certificates
2. **Environment Variables**: Use secrets management (AWS Secrets Manager, etc.)
3. **Logging**: Configure structured logging with log aggregation
4. **Monitoring**: Implement health checks and metrics (Prometheus)
5. **Rate Limiting**: Implement per-user rate limits
6. **Database Backups**: Automated daily backups
7. **Scaling**: Use load balancer for horizontal scaling

## API Documentation

FastAPI automatically generates OpenAPI documentation:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

Documentation includes:
- All endpoints with request/response schemas
- Authentication requirements
- Example requests and responses
- Error codes and descriptions
- Interactive API testing interface
