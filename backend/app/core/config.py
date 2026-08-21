import os
from typing import List
from dotenv import load_dotenv

# Load from backend/.env if present, otherwise system env
load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))

class Settings:
    PROJECT_NAME: str = "ProcuraAI Backend"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "").strip()

    # AI Configuration
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "openrouter")
    AI_MODEL: str = os.getenv("AI_MODEL", "anthropic/claude-3.5-sonnet")
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "").strip()

    # CORS
    CORS_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"
        ).split(",")
        if origin.strip()
    ]

settings = Settings()
