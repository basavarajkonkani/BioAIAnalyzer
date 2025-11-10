# Requirements Document

## Introduction

The BioAI Analyzer Frontend is a modern, responsive React.js web application that provides an intuitive interface for biological sequence analysis. The application enables users to input DNA, RNA, or protein sequences through text or file upload, visualize analysis results with interactive charts, manage their analysis history, and authenticate securely. The frontend communicates with a FastAPI backend to perform computational biology operations using Biopython.

## Glossary

- **Frontend Application**: The React.js-based user interface component of the BioAI Analyzer system
- **User**: An authenticated individual who interacts with the Frontend Application to analyze biological sequences
- **Sequence Input**: DNA, RNA, or protein data provided by the User through text entry or file upload
- **Analysis Result**: Processed biological data returned from the backend including GC content, translations, and statistics
- **Dashboard**: The main interface component displaying analysis tools and results
- **Authentication System**: JWT or Supabase-based mechanism for user identity verification
- **FASTA Format**: A text-based format for representing nucleotide or peptide sequences
- **GenBank Format**: NCBI's standard format for biological sequence data with annotations
- **Chart Component**: Visual representation of analysis data using Recharts or Chart.js libraries

## Requirements

### Requirement 1

**User Story:** As a researcher, I want to input biological sequences through multiple methods, so that I can analyze data in my preferred format

#### Acceptance Criteria

1.1 WHEN the User navigates to the Dashboard, THE Frontend Application SHALL display three tab options labeled "DNA", "RNA", and "Protein"

1.2 WHILE the User is on any sequence tab, THE Frontend Application SHALL provide a text input area accepting alphanumeric characters for manual sequence entry

1.3 WHEN the User clicks the file upload button, THE Frontend Application SHALL accept files with extensions ".fasta", ".fa", ".gb", and ".gbk"

1.4 IF the User uploads a file with an unsupported extension, THEN THE Frontend Application SHALL display an error message stating "Unsupported file format. Please upload FASTA or GenBank files"

1.5 THE Frontend Application SHALL validate sequence input to contain only valid characters (A, T, G, C for DNA; A, U, G, C for RNA; standard amino acid codes for Protein)

### Requirement 2

**User Story:** As a researcher, I want to see my analysis results displayed clearly with visualizations, so that I can quickly understand the sequence characteristics

#### Acceptance Criteria

2.1 WHEN the backend returns analysis results, THE Frontend Application SHALL display the results in a dedicated Result Section below the input area

2.2 THE Frontend Application SHALL render GC content as a percentage value with two decimal precision

2.3 THE Frontend Application SHALL display nucleotide frequency counts using a bar chart visualization component

2.4 WHEN protein translation data is available, THE Frontend Application SHALL show the translated protein sequence in monospace font

2.5 THE Frontend Application SHALL render at least one pie chart showing nucleotide composition distribution using Recharts or Chart.js library

### Requirement 3

**User Story:** As a researcher, I want to view my previous analyses with timestamps, so that I can track my work and revisit past results

#### Acceptance Criteria

3.1 WHEN the User navigates to the History Page, THE Frontend Application SHALL send a GET request to the "/history" endpoint with the User's authentication token

3.2 THE Frontend Application SHALL display a list of previous analyses with columns for sequence type, input preview (first 20 characters), timestamp, and action buttons

3.3 WHEN the User clicks on a history item, THE Frontend Application SHALL load and display the complete analysis results

3.4 THE Frontend Application SHALL format timestamps in "YYYY-MM-DD HH:MM:SS" format

3.5 IF the history request fails, THEN THE Frontend Application SHALL display an error message "Unable to load analysis history"

### Requirement 4

**User Story:** As a user, I want to register, login, and logout securely, so that my analysis data remains private and protected

#### Acceptance Criteria

4.1 THE Frontend Application SHALL provide separate pages for user registration and login accessible from the navigation menu

4.2 WHEN the User submits the registration form, THE Frontend Application SHALL send a POST request to "/auth/register" with name, email, and password fields

4.3 WHEN the User submits the login form, THE Frontend Application SHALL send a POST request to "/auth/login" with email and password credentials

4.4 WHEN authentication succeeds, THE Frontend Application SHALL store the JWT token in browser localStorage or sessionStorage

4.5 WHEN the User clicks logout, THE Frontend Application SHALL remove the authentication token from storage and redirect to the login page

4.6 THE Frontend Application SHALL include the JWT token in the Authorization header for all protected API requests

### Requirement 5

**User Story:** As a user, I want the application to be responsive and visually appealing, so that I can use it comfortably on any device

#### Acceptance Criteria

5.1 THE Frontend Application SHALL use Tailwind CSS framework for all styling implementations

5.2 THE Frontend Application SHALL implement a color scheme using black, white, and blue as primary colors

5.3 WHEN the viewport width is less than 768 pixels, THE Frontend Application SHALL display a mobile-optimized layout with stacked components

5.4 THE Frontend Application SHALL render correctly on screen widths ranging from 320 pixels to 2560 pixels

5.5 THE Frontend Application SHALL maintain readable text with minimum font size of 14 pixels on mobile devices

### Requirement 6

**User Story:** As a user, I want to learn about the project and its scientific foundation, so that I can understand the tools and methodologies used

#### Acceptance Criteria

6.1 THE Frontend Application SHALL provide an About Page accessible from the main navigation menu

6.2 THE Frontend Application SHALL display a project overview section describing the BioAI Analyzer purpose and capabilities

6.3 THE Frontend Application SHALL include a citation for Biopython: "Cock, P.J.A. et al. (2009). Biopython: freely available Python tools for computational molecular biology and bioinformatics. Bioinformatics, 25(11), 1422–1423. DOI: 10.1093/bioinformatics/btp163"

6.4 THE Frontend Application SHALL list the technology stack including React.js, Tailwind CSS, FastAPI, and Biopython

### Requirement 7

**User Story:** As a researcher, I want the application to communicate with the backend API reliably, so that my sequence analyses are processed correctly

#### Acceptance Criteria

7.1 THE Frontend Application SHALL use Axios library for all HTTP requests to the backend API

7.2 WHEN the User submits a sequence for analysis, THE Frontend Application SHALL send a POST request to "/analyze" endpoint with the sequence data and type

7.3 WHEN the User uploads a file, THE Frontend Application SHALL send a POST request to "/upload" endpoint with multipart/form-data encoding

7.4 IF an API request fails with network error, THEN THE Frontend Application SHALL display an error message "Unable to connect to server. Please try again"

7.5 THE Frontend Application SHALL implement a loading indicator visible during API request processing with minimum display duration of 300 milliseconds

7.6 IF the backend returns an error response, THEN THE Frontend Application SHALL display the error message from the response body to the User
