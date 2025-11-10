"""
Application configuration using Pydantic settings.
"""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    All settings can be configured via .env file or environment variables.
    """
    
    # Database Configuration
    DATABASE_URL: str
    
    # Security Settings
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24
    
    # Application Settings
    APP_NAME: str = "BioAI Analyzer Backend"
    DEBUG: bool = False
    
    # File Upload Settings
    MAX_FILE_SIZE: int = 10485760  # 10MB in bytes
    
    # CORS Settings
    ALLOWED_ORIGINS: str = "https://bioai.nighan2labs.in,http://localhost:5173"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """
        Parse ALLOWED_ORIGINS string into a list.
        
        Returns:
            List of allowed origin URLs
        """
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]


# Create global settings instance
settings = Settings()
