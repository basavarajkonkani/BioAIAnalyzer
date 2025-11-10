# Requirements Document

## Introduction

The BioAI Analyzer Backend is a RESTful API service built with FastAPI that provides computational biology analysis capabilities for DNA, RNA, and protein sequences. The backend processes biological sequence data using Biopython, manages user authentication with JWT tokens, stores analysis history in a PostgreSQL database, and serves results to the React frontend application. The system supports both direct sequence input and file uploads in FASTA and GenBank formats.

## Glossary

- **Backend API**: The FastAPI-based server component that processes biological sequence analysis requests
- **User**: An authenticated individual with stored credentials who can submit sequences and access their analysis history
- **Sequence Data**: DNA, RNA, or protein input provided as text string or file content
- **Analysis Engine**: The Biopython-based processing module that computes sequence statistics and transformations
- **Database**: PostgreSQL relational database storing user accounts and analysis history records
- **JWT Token**: JSON Web Token used for stateless authentication between frontend and Backend API
- **FASTA Parser**: Biopython component that reads FASTA format sequence files
- **GenBank Parser**: Biopython component that reads GenBank format sequence files
- **GC Content**: The percentage of guanine and cytosine nucleotides in a DNA or RNA sequence
- **ORF**: Open Reading Frame, a continuous stretch of codons between start and stop codons
- **Translation**: The process of converting DNA or RNA sequence into protein sequence

## Requirements

### Requirement 1

**User Story:** As a system administrator, I want the backend to authenticate users securely, so that only authorized individuals can access analysis features and their personal data

#### Acceptance Criteria

1.1 WHEN a client sends a POST request to "/auth/register" with name, email, and password fields, THE Backend API SHALL create a new user account with hashed password storage

1.2 IF the registration email already exists in the Database, THEN THE Backend API SHALL return HTTP status 400 with error message "Email already registered"

1.3 WHEN a client sends a POST request to "/auth/login" with valid email and password credentials, THE Backend API SHALL return a JWT Token with 24-hour expiration and user profile data

1.4 IF the login credentials are invalid, THEN THE Backend API SHALL return HTTP status 401 with error message "Invalid email or password"

1.5 THE Backend API SHALL hash all passwords using bcrypt algorithm with minimum cost factor of 12 before storing in the Database

1.6 THE Backend API SHALL validate JWT Tokens on all protected endpoints and return HTTP status 401 if token is missing, expired, or invalid

### Requirement 2

**User Story:** As a researcher, I want to submit DNA sequences for analysis, so that I can obtain GC content, nucleotide counts, and protein translations

#### Acceptance Criteria

2.1 WHEN a client sends a POST request to "/analyze" with sequence data and type "DNA", THE Backend API SHALL calculate GC content as a percentage with two decimal precision

2.2 THE Backend API SHALL count occurrences of each nucleotide (A, T, G, C) in the DNA sequence and return the counts as a dictionary

2.3 WHEN analyzing DNA sequences, THE Backend API SHALL translate the sequence into protein using the standard genetic code and return the protein sequence

2.4 THE Backend API SHALL identify all Open Reading Frames with minimum length of 100 nucleotides and return their start positions, end positions, and sequences

2.5 IF the DNA sequence contains invalid characters other than A, T, G, C, THEN THE Backend API SHALL return HTTP status 400 with error message "Invalid DNA sequence: contains invalid characters"

2.6 THE Backend API SHALL accept DNA sequences with minimum length of 10 nucleotides and maximum length of 100000 nucleotides

### Requirement 3

**User Story:** As a researcher, I want to submit RNA sequences for analysis, so that I can obtain nucleotide statistics and protein translations

#### Acceptance Criteria

3.1 WHEN a client sends a POST request to "/analyze" with sequence data and type "RNA", THE Backend API SHALL calculate GC content as a percentage with two decimal precision

3.2 THE Backend API SHALL count occurrences of each nucleotide (A, U, G, C) in the RNA sequence and return the counts as a dictionary

3.3 WHEN analyzing RNA sequences, THE Backend API SHALL translate the sequence into protein using the standard genetic code and return the protein sequence

3.4 IF the RNA sequence contains invalid characters other than A, U, G, C, THEN THE Backend API SHALL return HTTP status 400 with error message "Invalid RNA sequence: contains invalid characters"

3.5 THE Backend API SHALL accept RNA sequences with minimum length of 10 nucleotides and maximum length of 100000 nucleotides

### Requirement 4

**User Story:** As a researcher, I want to submit protein sequences for analysis, so that I can obtain amino acid composition statistics

#### Acceptance Criteria

4.1 WHEN a client sends a POST request to "/analyze" with sequence data and type "Protein", THE Backend API SHALL calculate the molecular weight in Daltons with two decimal precision

4.2 THE Backend API SHALL count occurrences of each amino acid in the protein sequence and return the counts as a dictionary

4.3 THE Backend API SHALL calculate the isoelectric point (pI) with two decimal precision using Biopython ProteinAnalysis module

4.4 IF the protein sequence contains invalid characters other than standard 20 amino acid codes, THEN THE Backend API SHALL return HTTP status 400 with error message "Invalid protein sequence: contains invalid characters"

4.5 THE Backend API SHALL accept protein sequences with minimum length of 5 amino acids and maximum length of 50000 amino acids

### Requirement 5

**User Story:** As a researcher, I want to upload sequence files in standard formats, so that I can analyze data from external sources without manual copying

#### Acceptance Criteria

5.1 WHEN a client sends a POST request to "/upload" with a file having extension ".fasta" or ".fa", THE Backend API SHALL parse the file using Biopython FASTA Parser

5.2 WHEN a client sends a POST request to "/upload" with a file having extension ".gb" or ".gbk", THE Backend API SHALL parse the file using Biopython GenBank Parser

5.3 IF the uploaded file size exceeds 10 megabytes, THEN THE Backend API SHALL return HTTP status 413 with error message "File size exceeds maximum limit of 10MB"

5.4 IF the uploaded file format is not FASTA or GenBank, THEN THE Backend API SHALL return HTTP status 400 with error message "Unsupported file format"

5.5 WHEN the file contains multiple sequences, THE Backend API SHALL analyze only the first sequence and return its results

5.6 THE Backend API SHALL automatically detect sequence type (DNA, RNA, or Protein) from the parsed file content

### Requirement 6

**User Story:** As a researcher, I want my analysis results saved automatically, so that I can review past analyses and track my research progress

#### Acceptance Criteria

6.1 WHEN the Backend API successfully completes a sequence analysis, THE Backend API SHALL store the input sequence, results, sequence type, and timestamp in the Database associated with the authenticated User

6.2 WHEN a client sends a GET request to "/history" with valid JWT Token, THE Backend API SHALL return all analysis records for that User ordered by timestamp descending

6.3 THE Backend API SHALL limit history results to 100 most recent records per request

6.4 WHEN a client sends a GET request to "/history/{id}" with valid JWT Token, THE Backend API SHALL return the complete analysis record if the record belongs to the authenticated User

6.5 IF the requested history record does not belong to the authenticated User, THEN THE Backend API SHALL return HTTP status 403 with error message "Access denied"

6.6 WHEN a client sends a DELETE request to "/history/{id}" with valid JWT Token, THE Backend API SHALL delete the analysis record if it belongs to the authenticated User

### Requirement 7

**User Story:** As a system administrator, I want the backend to handle errors gracefully, so that clients receive clear error messages and the system remains stable

#### Acceptance Criteria

7.1 WHEN an unhandled exception occurs during request processing, THE Backend API SHALL return HTTP status 500 with error message "Internal server error"

7.2 THE Backend API SHALL log all errors with timestamp, endpoint, user identifier, and stack trace to the application log file

7.3 IF a database connection fails, THEN THE Backend API SHALL return HTTP status 503 with error message "Service temporarily unavailable"

7.4 WHEN request validation fails, THE Backend API SHALL return HTTP status 422 with detailed field-level error messages

7.5 THE Backend API SHALL implement request timeout of 30 seconds for all analysis operations

7.6 IF an analysis operation exceeds the timeout, THEN THE Backend API SHALL return HTTP status 504 with error message "Analysis timeout: sequence too complex"

### Requirement 8

**User Story:** As a developer, I want the backend to provide clear API documentation, so that I can integrate with the service efficiently

#### Acceptance Criteria

8.1 THE Backend API SHALL generate OpenAPI 3.0 specification automatically using FastAPI built-in documentation

8.2 THE Backend API SHALL serve interactive API documentation at "/docs" endpoint using Swagger UI

8.3 THE Backend API SHALL serve alternative API documentation at "/redoc" endpoint using ReDoc

8.4 THE Backend API SHALL include request examples, response schemas, and authentication requirements in the API documentation

8.5 THE Backend API SHALL document all possible HTTP status codes and error responses for each endpoint

### Requirement 9

**User Story:** As a system administrator, I want the backend to implement CORS properly, so that the frontend application can communicate with the API from different domains

#### Acceptance Criteria

9.1 THE Backend API SHALL accept requests from origin "https://bioai.nighan2labs.in" in production environment

9.2 THE Backend API SHALL accept requests from origin "http://localhost:5173" in development environment

9.3 THE Backend API SHALL include "Authorization" header in the allowed CORS headers list

9.4 THE Backend API SHALL support preflight OPTIONS requests for all endpoints

9.5 THE Backend API SHALL include appropriate CORS headers in all HTTP responses

### Requirement 10

**User Story:** As a system administrator, I want the backend to validate all inputs rigorously, so that the system is protected from malicious data and injection attacks

#### Acceptance Criteria

10.1 THE Backend API SHALL validate email format using RFC 5322 standard regular expression pattern

10.2 THE Backend API SHALL enforce password minimum length of 8 characters for registration

10.3 THE Backend API SHALL sanitize all sequence input by removing whitespace and converting to uppercase before processing

10.4 THE Backend API SHALL reject requests with missing required fields and return HTTP status 422 with field-specific error messages

10.5 THE Backend API SHALL use Pydantic models for all request and response validation
