# BioAI Analyzer Frontend

A modern React.js web application for biological sequence analysis.

## Tech Stack

- React 18+
- Vite
- Tailwind CSS
- React Router v6
- Axios
- Recharts

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL

### Development

Run the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── services/       # API services
├── utils/          # Utility functions
├── hooks/          # Custom React hooks
├── context/        # React context providers
├── App.jsx         # Root component
├── main.jsx        # Entry point
└── index.css       # Global styles
```

## Environment Variables

- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_MAX_FILE_SIZE` - Maximum file upload size in bytes

## License

MIT
