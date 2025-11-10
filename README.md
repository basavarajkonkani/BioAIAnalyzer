# 🧬 BioAI Analyzer

A full-stack web application for computational biology sequence analysis. Analyze DNA, RNA, and protein sequences with powerful bioinformatics tools powered by Biopython.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![React](https://img.shields.io/badge/react-18.3+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green.svg)

## ✨ Features

### 🔬 Sequence Analysis
- **DNA Analysis**: GC content calculation, nucleotide counts, protein translation, ORF detection
- **RNA Analysis**: GC content, nucleotide composition, protein translation
- **Protein Analysis**: Molecular weight, amino acid composition, isoelectric point calculation

### 📁 File Support
- Upload and analyze FASTA and GenBank format files
- Batch processing of multiple sequences
- File validation and error handling

### 👤 User Management
- Secure user registration and authentication with JWT tokens
- Password hashing with bcrypt
- Protected routes and API endpoints

### 📊 Analysis History
- Store and retrieve past analysis results
- View detailed analysis reports
- Delete unwanted history entries
- Filter and search through analysis history

### 🎨 Modern UI/UX
- Responsive design for mobile and desktop
- Interactive data visualizations with Recharts
- Real-time analysis feedback
- Toast notifications for user actions

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Relational database
- **Biopython** - Computational biology library
- **Alembic** - Database migrations
- **JWT** - Stateless authentication
- **Bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Tailwind CSS** - Utility-first CSS framework

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Pytest** - Backend testing
- **Vitest** - Frontend testing

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker and Docker Compose (optional, for containerized deployment)

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/basavarajkonkani/BioAIAnalyzer.git
   cd BioAIAnalyzer
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cd bioai-analyzer-backend
   cp .env.example .env
   # Edit .env and set your SECRET_KEY
   
   # Frontend
   cd ../bioai-analyzer-frontend
   cp .env.example .env
   ```

3. **Start the backend services**
   ```bash
   cd bioai-analyzer-backend
   docker-compose up -d
   ```

4. **Start the frontend**
   ```bash
   cd bioai-analyzer-frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Setup

#### Backend Setup

1. **Create virtual environment**
   ```bash
   cd bioai-analyzer-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up PostgreSQL database**
   ```bash
   createdb bioai_db
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and SECRET_KEY
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Start the backend server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend Setup

1. **Install dependencies**
   ```bash
   cd bioai-analyzer-frontend
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env to set VITE_API_URL (default: http://localhost:8000)
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 📖 Usage

### 1. Register an Account
- Navigate to the registration page
- Provide your name, email, and password
- Click "Register" to create your account

### 2. Login
- Enter your email and password
- Click "Login" to access the dashboard

### 3. Analyze Sequences

#### Text Input
- Select the sequence type (DNA, RNA, or Protein)
- Paste or type your sequence
- Click "Analyze" to get results

#### File Upload
- Click "Upload File"
- Select a FASTA or GenBank file
- View the analysis results

### 4. View History
- Navigate to the History page
- View all your past analyses
- Click on any analysis to see detailed results
- Delete unwanted entries

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Analysis Endpoints

All analysis endpoints require authentication via Bearer token.

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

For complete API documentation, visit http://localhost:8000/docs when running the backend.

## 🧪 Testing

### Backend Tests
```bash
cd bioai-analyzer-backend
pytest
pytest --cov=app --cov-report=html  # With coverage
```

### Frontend Tests
```bash
cd bioai-analyzer-frontend
npm test
npm run test:coverage  # With coverage
```

## 📁 Project Structure

```
BioAIAnalyzer/
├── bioai-analyzer-backend/
│   ├── app/
│   │   ├── crud/              # Database operations
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/            # SQLAlchemy models
│   │   ├── routes/            # API endpoints
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   └── utils/             # Utility functions
│   ├── alembic/               # Database migrations
│   ├── tests/                 # Backend tests
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── requirements.txt
│
├── bioai-analyzer-frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # React context
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── utils/             # Utility functions
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── .kiro/specs/               # Project specifications
```

## 🔒 Security Features

- JWT-based authentication with secure token management
- Password hashing using bcrypt with salt rounds
- CORS configuration for secure cross-origin requests
- Input validation and sanitization
- SQL injection prevention via SQLAlchemy ORM
- Rate limiting and timeout middleware
- Secure file upload validation

## 🌐 Deployment

### Backend Deployment

1. **Build Docker image**
   ```bash
   cd bioai-analyzer-backend
   docker build -t bioai-backend:latest .
   ```

2. **Set production environment variables**
   ```bash
   export SECRET_KEY="your-strong-secret-key"
   export DEBUG=False
   export DATABASE_URL="your-production-database-url"
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Frontend Deployment

The frontend can be deployed to Vercel, Netlify, or any static hosting service.

#### Vercel Deployment
```bash
cd bioai-analyzer-frontend
npm run build
vercel --prod
```

#### Environment Variables for Production
- `VITE_API_URL`: Your production backend URL
- `VITE_ENV`: Set to "production"

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Basavaraj Konkani**
- GitHub: [@basavarajkonkani](https://github.com/basavarajkonkani)

## 🙏 Acknowledgments

- [Biopython](https://biopython.org/) - Computational biology tools
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/basavarajkonkani/BioAIAnalyzer/issues)
- Check the API documentation at `/docs`
- Review the design documents in `.kiro/specs/`

---

Made with ❤️ for the bioinformatics community
