"""
BioAI Analyzer Backend - Main Application Entry Point

FastAPI application for biological sequence analysis with authentication,
file upload support, and analysis history management.
"""

import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError, DatabaseError

from app.config import settings
from app.routes import auth, analysis, history
from app.middleware.error_handler import (
    global_exception_handler,
    database_exception_handler,
    TimeoutMiddleware
)

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="RESTful API service for computational biology analysis of DNA, RNA, and protein sequences",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Add CORS middleware
# Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add timeout middleware
# Requirements: 7.5, 7.6
app.add_middleware(TimeoutMiddleware, timeout=30)

# Register exception handlers
# Requirements: 7.1, 7.2, 7.3
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(OperationalError, database_exception_handler)
app.add_exception_handler(DatabaseError, database_exception_handler)

# Register routers
# Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
app.include_router(auth.router)
app.include_router(analysis.router)
app.include_router(history.router)


@app.get("/", tags=["health"])
async def root():
    """
    Root endpoint - Health check.
    
    Returns:
        dict: API status and version information
    """
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", tags=["health"])
async def health_check():
    """
    Health check endpoint for monitoring.
    
    Returns:
        dict: Service health status
    """
    return {
        "status": "healthy",
        "service": settings.APP_NAME
    }


# Log startup
@app.on_event("startup")
async def startup_event():
    """Log application startup."""
    logger.info(f"{settings.APP_NAME} starting up...")
    logger.info(f"Debug mode: {settings.DEBUG}")
    logger.info(f"Allowed origins: {settings.allowed_origins_list}")


@app.on_event("shutdown")
async def shutdown_event():
    """Log application shutdown."""
    logger.info(f"{settings.APP_NAME} shutting down...")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
