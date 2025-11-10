"""
Global error handling middleware for the BioAI Analyzer Backend.
Handles all exceptions and provides consistent error responses.
"""

import logging
import traceback
from datetime import datetime
from fastapi import Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError, DatabaseError

# Configure logger
logger = logging.getLogger(__name__)


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Handle all unhandled exceptions globally.
    Logs errors with timestamp, endpoint, and stack trace.
    Returns 500 for unhandled exceptions.
    
    Requirements: 7.1, 7.2
    """
    # Log error with full details
    timestamp = datetime.utcnow().isoformat()
    endpoint = f"{request.method} {request.url.path}"
    stack_trace = traceback.format_exc()
    
    logger.error(
        f"Unhandled exception at {timestamp}\n"
        f"Endpoint: {endpoint}\n"
        f"Error: {str(exc)}\n"
        f"Stack trace:\n{stack_trace}"
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"}
    )


async def database_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Handle database connection failures.
    Returns 503 for database connection errors.
    
    Requirements: 7.3
    """
    # Log error with full details
    timestamp = datetime.utcnow().isoformat()
    endpoint = f"{request.method} {request.url.path}"
    
    logger.error(
        f"Database connection failure at {timestamp}\n"
        f"Endpoint: {endpoint}\n"
        f"Error: {str(exc)}"
    )
    
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": "Service temporarily unavailable"}
    )


import asyncio
from starlette.middleware.base import BaseHTTPMiddleware


class TimeoutMiddleware(BaseHTTPMiddleware):
    """
    Middleware to handle request timeouts.
    Sets timeout to 30 seconds and returns 504 for timeout errors.
    
    Requirements: 7.5, 7.6
    """
    
    def __init__(self, app, timeout: int = 30):
        super().__init__(app)
        self.timeout = timeout
    
    async def dispatch(self, request: Request, call_next):
        """
        Process request with timeout.
        Returns 504 if request exceeds timeout limit.
        """
        try:
            return await asyncio.wait_for(call_next(request), timeout=self.timeout)
        except asyncio.TimeoutError:
            # Log timeout error
            timestamp = datetime.utcnow().isoformat()
            endpoint = f"{request.method} {request.url.path}"
            
            logger.warning(
                f"Request timeout at {timestamp}\n"
                f"Endpoint: {endpoint}\n"
                f"Timeout: {self.timeout} seconds"
            )
            
            return JSONResponse(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                content={"detail": "Analysis timeout: sequence too complex"}
            )
