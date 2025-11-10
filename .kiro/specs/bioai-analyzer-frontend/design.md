# Design Document

## Overview

The BioAI Analyzer Frontend is a single-page React application built with modern web technologies. It provides an intuitive interface for biological sequence analysis with real-time visualization, authentication, and history management. The application follows a component-based architecture with clear separation of concerns between UI components, state management, API communication, and routing.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              App Component (Router)                    │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │           Protected Routes                       │  │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │  │  │
│  │  │  │Dashboard │  │ History  │  │    About     │  │  │  │
│  │  │  └──────────┘  └──────────┘  └──────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │           Public Routes                          │  │  │
│  │  │  ┌──────────┐  ┌──────────┐                     │  │  │
│  │  │  │  Login   │  │ Register │                     │  │  │
│  │  │  └──────────┘  └──────────┘                     │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Services Layer                            │  │
│  │  ┌──────────────┐  ┌──────────────┐                  │  │
│  │  │  API Service │  │ Auth Service │                  │  │
│  │  └──────────────┘  └──────────────┘                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Axios HTTP
                            ▼
                  ┌──────────────────┐
                  │  FastAPI Backend │
                  └──────────────────┘
```

### Technology Stack

- **React 18+**: Core UI framework with hooks
- **React Router v6**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Data visualization library
- **Axios**: HTTP client for API communication
- **Vite**: Build tool and development server

### Project Structure

```
bioai-analyzer-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── dashboard/
│   │   │   ├── SequenceTabs.jsx
│   │   │   ├── SequenceInput.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   └── ResultsDisplay.jsx
│   │   ├── charts/
│   │   │   ├── NucleotideBarChart.jsx
│   │   │   └── CompositionPieChart.jsx
│   │   ├── history/
│   │   │   ├── HistoryList.jsx
│   │   │   └── HistoryItem.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   └── common/
│   │       ├── LoadingSpinner.jsx
│   │       ├── ErrorMessage.jsx
│   │       └── Button.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── History.jsx
│   │   ├── About.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js
│   ├── utils/
│   │   ├── validators.js
│   │   └── formatters.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useAnalysis.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Components and Interfaces

### Core Components

#### 1. App Component
- **Purpose**: Root component managing routing and global state
- **State**: None (delegates to context)
- **Props**: None
- **Key Features**:
  - React Router setup with protected routes
  - AuthContext provider wrapper
  - Global error boundary

#### 2. Dashboard Page
- **Purpose**: Main analysis interface
- **State**:
  - `activeTab`: 'DNA' | 'RNA' | 'Protein'
  - `sequenceInput`: string
  - `analysisResults`: object | null
  - `isLoading`: boolean
  - `error`: string | null
- **Key Features**:
  - Tab switching for sequence types
  - Input validation before submission
  - Results display with charts
  - File upload integration

#### 3. SequenceInput Component
- **Props**:
  - `value`: string
  - `onChange`: (value: string) => void
  - `sequenceType`: 'DNA' | 'RNA' | 'Protein'
  - `onSubmit`: () => void
- **Validation**: Real-time character validation based on sequence type

#### 4. FileUpload Component
- **Props**:
  - `onFileSelect`: (file: File) => void
  - `acceptedFormats`: string[]
- **Features**:
  - Drag-and-drop support
  - File type validation
  - File size limit (10MB)

#### 5. ResultsDisplay Component
- **Props**:
  - `results`: AnalysisResult
- **Displays**:
  - GC content percentage
  - Protein sequence (if applicable)
  - Nucleotide counts
  - ORF information
  - Interactive charts

#### 6. Chart Components
- **NucleotideBarChart**:
  - Props: `data: { nucleotide: string, count: number }[]`
  - Library: Recharts BarChart
  
- **CompositionPieChart**:
  - Props: `data: { name: string, value: number }[]`
  - Library: Recharts PieChart

#### 7. History Components
- **HistoryList**:
  - Fetches and displays analysis history
  - Pagination support (20 items per page)
  - Click to view full results
  
- **HistoryItem**:
  - Props: `analysis: HistoryRecord`
  - Displays: timestamp, sequence preview, type, action button

#### 8. Auth Components
- **LoginForm**:
  - Fields: email, password
  - Validation: email format, password min length (8 chars)
  - Submits to `/auth/login`
  
- **RegisterForm**:
  - Fields: name, email, password, confirmPassword
  - Validation: matching passwords, email uniqueness
  - Submits to `/auth/register`

### Protected Route Component
```jsx
<ProtectedRoute>
  - Checks authentication status
  - Redirects to /login if not authenticated
  - Renders children if authenticated
</ProtectedRoute>
```

## Data Models

### Frontend Data Structures

#### AnalysisResult
```typescript
interface AnalysisResult {
  gc_content: string;           // e.g., "52.34%"
  protein_sequence?: string;    // Translated sequence
  nucleotide_counts: {
    [key: string]: number;      // e.g., { "A": 20, "T": 18 }
  };
  orfs?: Array<{
    start: number;
    end: number;
    sequence: string;
  }>;
  sequence_length: number;
  sequence_type: 'DNA' | 'RNA' | 'Protein';
}
```

#### HistoryRecord
```typescript
interface HistoryRecord {
  id: number;
  user_id: number;
  input_sequence: string;
  results: AnalysisResult;
  created_at: string;           // ISO 8601 format
}
```

#### AuthResponse
```typescript
interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
```

#### User
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}
```

## Services Layer

### API Service (`services/api.js`)

```javascript
// Base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

// API methods
export const analyzeSequence = (sequenceData) => 
  apiClient.post('/analyze', sequenceData);

export const uploadFile = (formData) => 
  apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getHistory = () => 
  apiClient.get('/history');
```

### Auth Service (`services/auth.js`)

```javascript
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  const { access_token, user } = response.data;
  localStorage.setItem('token', access_token);
  localStorage.setItem('user', JSON.stringify(user));
  return { token: access_token, user };
};

export const register = async (name, email, password) => {
  const response = await apiClient.post('/auth/register', { name, email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
```

## State Management

### AuthContext

```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const login = async (email, password) => {
    const { token, user } = await authService.login(email, password);
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Custom Hooks

#### useAnalysis Hook
```javascript
export const useAnalysis = () => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async (sequence, type) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyzeSequence({ sequence, type });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { results, isLoading, error, analyze };
};
```

## Styling and Theme

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',  // Main blue
          600: '#2563eb',
          700: '#1d4ed8',
        },
        dark: '#0f172a',    // Black/dark background
      },
      fontFamily: {
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

### Color Scheme
- **Primary**: Blue (#3b82f6) - buttons, links, highlights
- **Background**: White (#ffffff) - main content areas
- **Dark**: Black/Slate (#0f172a) - navbar, footer, text
- **Accent**: Light blue (#dbeafe) - hover states, borders
- **Success**: Green - successful operations
- **Error**: Red - error messages

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Error Handling

### Error Types and Handling

1. **Network Errors**:
   - Display: "Unable to connect to server. Please try again"
   - Action: Retry button

2. **Validation Errors**:
   - Display: Inline error messages below input fields
   - Prevent form submission

3. **Authentication Errors**:
   - 401: Redirect to login page
   - Display: "Session expired. Please login again"

4. **API Errors**:
   - Display: Error message from backend response
   - Fallback: "An error occurred. Please try again"

5. **File Upload Errors**:
   - Invalid format: "Unsupported file format"
   - Size limit: "File size exceeds 10MB limit"

### Error Display Component
```jsx
<ErrorMessage 
  message={error} 
  onDismiss={() => setError(null)}
  type="error|warning|info"
/>
```

## Testing Strategy

### Unit Testing
- **Framework**: Vitest + React Testing Library
- **Coverage Target**: 70% minimum
- **Focus Areas**:
  - Component rendering
  - User interactions
  - Form validation
  - Utility functions

### Integration Testing
- **Focus**: Component interactions with services
- **Mock**: API calls using MSW (Mock Service Worker)
- **Test Cases**:
  - Login flow
  - Sequence analysis submission
  - History retrieval

### E2E Testing (Optional)
- **Framework**: Playwright or Cypress
- **Critical Paths**:
  - Complete analysis workflow
  - Authentication flow
  - History navigation

### Testing Examples

```javascript
// Component test
describe('SequenceInput', () => {
  it('validates DNA sequence input', () => {
    render(<SequenceInput sequenceType="DNA" />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'ATGCX' } });
    expect(screen.getByText(/invalid character/i)).toBeInTheDocument();
  });
});

// Service test
describe('API Service', () => {
  it('includes auth token in requests', async () => {
    localStorage.setItem('token', 'test-token');
    await analyzeSequence({ sequence: 'ATGC', type: 'DNA' });
    expect(mockAxios.post).toHaveBeenCalledWith(
      '/analyze',
      expect.any(Object),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    );
  });
});
```

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**:
   - Lazy load routes using React.lazy()
   - Separate vendor bundles

2. **Memoization**:
   - Use React.memo for expensive components
   - useMemo for complex calculations
   - useCallback for event handlers

3. **Asset Optimization**:
   - Compress images
   - Use SVG for icons
   - Minimize bundle size

4. **API Optimization**:
   - Debounce input validation
   - Cache history results
   - Implement request cancellation

5. **Chart Performance**:
   - Limit data points for large datasets
   - Use virtualization for long lists

## Accessibility

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **ARIA Labels**: Proper labeling for screen readers
- **Color Contrast**: Minimum 4.5:1 ratio for text
- **Focus Indicators**: Visible focus states
- **Alt Text**: Descriptive text for images
- **Form Labels**: Associated labels for all inputs

### Implementation
```jsx
<button
  aria-label="Analyze sequence"
  className="focus:ring-2 focus:ring-primary-500"
>
  Analyze
</button>
```

## Security Considerations

1. **Token Storage**: Use httpOnly cookies (if backend supports) or localStorage with XSS protection
2. **Input Sanitization**: Validate and sanitize all user inputs
3. **HTTPS**: Enforce HTTPS in production
4. **CORS**: Configure proper CORS headers
5. **CSP**: Implement Content Security Policy headers
6. **Dependency Audits**: Regular npm audit checks

## Deployment Configuration

### Environment Variables
```
VITE_API_URL=https://api.bioai.nighan2labs.in
VITE_APP_NAME=BioAI Analyzer
VITE_MAX_FILE_SIZE=10485760
```

### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "@api-url"
  }
}
```

### Build Optimization
- Minification enabled
- Tree shaking
- Gzip compression
- Cache headers for static assets
