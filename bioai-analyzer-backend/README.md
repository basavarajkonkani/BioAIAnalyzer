# BioAI Analyzer Backend

A RESTful API service built with FastAPI that provides computational biology analysis capabilities for DNA, RNA, and protein sequences. The backend processes biological sequence data using Biopython, manages user authentication with JWT tokens, and stores analysis history in PostgreSQL.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **DNA Analysis**: GC content, nucleotide counts, protein translation, and ORF detection
- **RNA Analysis**: GC content, nucleotide counts, and protein translation
- **Protein Analysis**: Molecular weight, amino acid composition, and isoelectric point
- **File Upload**: Support for FASTA and GenBank format files
- **Analysis History**: Store and retrieve past analysis results
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation

## Technology Stack

- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database operations
- **PostgreSQL**: Relational database
- **Biopython**: Computational biology library
- **Alembic**: Database migrations
- **JWT**: Stateless authentication
- **Bcrypt**: Password hashing

## Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Docker and Docker Compose (for containerized deployment)

## Quick Start with Docker

The easiest way to run the application is using Docker Compose:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bioai-analyzer-backend
   ```

2. **Set environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and set your SECRET_KEY
   ```

3. **Start the services**
   ```bash
   docker-compose up -d
   ```

4. **Access the API**
   - API: http://localhost:8000
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

5. **Stop the services**
   ```bash
   docker-compose down
   ```

## Local Development Setup

### 1. Install Dependencies

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Database

Create a PostgreSQL database:

```bash
createdb bioai_db
```

### 3. Set Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/bioai_db
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_HOURS=24
DEBUG=True
```

### 4. Run Database Migrations

```bash
alembic upgrade head
```

### 5. Start the Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

## API Documentation

### Interactive Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Analysis Endpoints

All analysis endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

#### Analyze Sequence
```http
POST /analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "sequence": "ATGCATGCTAGC",
  "sequence_type": "DNA"
}
```

#### Upload File
```http
POST /upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <your-file.fasta>
```

### History Endpoints

#### Get Analysis History
```http
GET /history?limit=100&offset=0
Authorization: Bearer <token>
```

#### Get Single Analysis
```http
GET /history/{id}
Authorization: Bearer <token>
```

#### Delete Analysis
```http
DELETE /history/{id}
Authorization: Bearer <token>
```

## Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v
```

## Database Migrations

### Create a New Migration

```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply Migrations

```bash
alembic upgrade head
```

### Rollback Migration

```bash
alembic downgrade -1
```

## Project Structure

```
bioai-analyzer-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration management
│   ├── database.py             # Database connection
│   ├── models/                 # SQLAlchemy models
│   │   ├── user.py
│   │   └── analysis.py
│   ├── schemas/                # Pydantic schemas
│   │   ├── user.py
│   │   ├── auth.py
│   │   └── analysis.py
│   ├── routes/                 # API endpoints
│   │   ├── auth.py
│   │   ├── analysis.py
│   │   └── history.py
│   ├── services/               # Business logic
│   │   ├── auth_service.py
│   │   ├── analysis_service.py
│   │   └── file_service.py
│   ├── crud/                   # Database operations
│   │   ├── user.py
│   │   └── analysis.py
│   ├── utils/                  # Utilities
│   │   └── security.py
│   └── middleware/             # Middleware
│       └── error_handler.py
├── alembic/                    # Database migrations
├── tests/                      # Test files
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── alembic.ini
└── README.md
```

## Deployment

### Production Deployment with Docker

1. **Build the production image**
   ```bash
   docker build -t bioai-backend:latest .
   ```

2. **Set production environment variables**
   ```bash
   export SECRET_KEY="your-strong-secret-key"
   export DEBUG=False
   ```

3. **Run with docker-compose**
   ```bash
   docker-compose up -d
   ```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `SECRET_KEY` | JWT secret key | Required |
| `ALGORITHM` | JWT algorithm | HS256 |
| `ACCESS_TOKEN_EXPIRE_HOURS` | Token expiration time | 24 |
| `DEBUG` | Debug mode | False |
| `MAX_FILE_SIZE` | Maximum upload file size | 10485760 (10MB) |

### Production Considerations

1. **Security**
   - Use strong SECRET_KEY (generate with `openssl rand -hex 32`)
   - Enable HTTPS with reverse proxy (Nginx/Traefik)
   - Set DEBUG=False in production
   - Use environment-specific CORS origins

2. **Database**
   - Use managed PostgreSQL service (AWS RDS, Google Cloud SQL)
   - Enable automated backups
   - Configure connection pooling appropriately

3. **Monitoring**
   - Implement health check endpoint
   - Set up logging aggregation
   - Monitor API performance and errors

4. **Scaling**
   - Use load balancer for horizontal scaling
   - Consider caching layer (Redis) for frequently accessed data
   - Implement rate limiting per user

### Reverse Proxy Configuration (Nginx)

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs db

# Connect to database
docker-compose exec db psql -U bioai_user -d bioai_db
```

### Migration Issues

```bash
# Check current migration version
alembic current

# View migration history
alembic history

# Reset database (WARNING: destroys all data)
alembic downgrade base
alembic upgrade head
```

### Container Issues

```bash
# View container logs
docker-compose logs backend

# Restart services
docker-compose restart

# Rebuild containers
docker-compose up -d --build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the API documentation at `/docs`
- Review the design document in `.kiro/specs/bioai-analyzer-backend/design.md`

## Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Sequence analysis powered by [Biopython](https://biopython.org/)
- Database management with [SQLAlchemy](https://www.sqlalchemy.org/)
