# Deployment Guide

## Environment Configuration

### Development
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the variables in `.env` for your local development environment.

### Production
1. Copy `.env.production.example` to `.env.production`:
   ```bash
   cp .env.production.example .env.production
   ```

2. Update the production variables:
   - `VITE_API_URL`: Your production backend API URL
   - Other variables as needed

## Build Commands

### Development Build
```bash
npm run dev
```
Starts the development server on http://localhost:3000

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` directory

### Production Build (Explicit)
```bash
npm run build:prod
```
Explicitly builds for production mode

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing

## Vercel Deployment

### Automatic Deployment
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite framework
3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your production API URL
   - `VITE_APP_NAME`: BioAI Analyzer
   - `VITE_MAX_FILE_SIZE`: 10485760
   - `VITE_ENV`: production

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | http://localhost:8000 | Yes |
| `VITE_APP_NAME` | Application name | BioAI Analyzer | No |
| `VITE_MAX_FILE_SIZE` | Max file upload size (bytes) | 10485760 (10MB) | No |
| `VITE_ENV` | Environment mode | development | No |

## Build Output

The production build creates:
- `dist/index.html`: Main HTML file
- `dist/assets/`: Optimized JS, CSS, and other assets
- Code splitting for vendor libraries and charts
- Minified and tree-shaken bundles
- Gzip-optimized assets

## Performance Optimizations

The build includes:
- **Code Splitting**: Separate chunks for vendor, charts, and app code
- **Minification**: Using esbuild for fast minification
- **Tree Shaking**: Removes unused code
- **Asset Optimization**: Compressed CSS and JS
- **Cache Headers**: Configured in vercel.json for static assets

## Testing Production Build Locally

1. Build the project:
   ```bash
   npm run build
   ```

2. Preview the build:
   ```bash
   npm run preview
   ```

3. Open http://localhost:4173 in your browser

## Troubleshooting

### Build Fails
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript/ESLint errors: `npm run lint`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Environment Variables Not Working
- Ensure variables are prefixed with `VITE_`
- Restart the dev server after changing .env files
- For production, set variables in Vercel dashboard

### API Connection Issues
- Verify `VITE_API_URL` is correct
- Check CORS configuration on backend
- Ensure backend is accessible from frontend domain
