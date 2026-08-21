import os
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

def get_database_url() -> str:
    db_url = settings.DATABASE_URL
    if not db_url:
        # SQLite fallback ONLY when DATABASE_URL is absent
        sqlite_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../procura.db"))
        return f"sqlite:///{sqlite_path}"
    
    # Handle postgres:// vs postgresql:// for SQLAlchemy compatibility
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    return db_url

db_url = get_database_url()
is_sqlite = db_url.startswith("sqlite")

connect_args = {"check_same_thread": False} if is_sqlite else {}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def check_db_health() -> dict:
    """Verifies DB connection without silent fallbacks."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {
            "status": "connected",
            "type": "sqlite" if is_sqlite else "postgresql",
            "url_configured": bool(settings.DATABASE_URL)
        }
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return {
            "status": "unreachable",
            "error": str(e),
            "type": "sqlite" if is_sqlite else "postgresql",
            "url_configured": bool(settings.DATABASE_URL)
        }
