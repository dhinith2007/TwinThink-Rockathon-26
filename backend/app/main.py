import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.db.database import engine, Base
from app.db.seed import seed_db
from app.api.health import router as health_router
from app.api.procurement import router as procurement_router
from app.api.approvals import router as approvals_router
from app.api.vendors import router as vendors_router
from app.api.policies import router as policies_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("procura_ai")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist and seed baseline data
    logger.info("Initializing ProcuraAI Database & Policies...")
    try:
        seed_db()
        logger.info("ProcuraAI Engine ready for requests.")
    except Exception as e:
        logger.error(f"Database startup failed: {e}")
    yield
    logger.info("Shutting down ProcuraAI Engine.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Autonomous Enterprise Procurement Intelligence Engine — ROCKATHON'26 Round 2 MVP",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.method} {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}"}
    )

# Include API Routers
app.include_router(health_router, prefix=settings.API_PREFIX)
app.include_router(procurement_router, prefix=settings.API_PREFIX)
app.include_router(approvals_router, prefix=settings.API_PREFIX)
app.include_router(vendors_router, prefix=settings.API_PREFIX)
app.include_router(policies_router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "product": "ProcuraAI",
        "tagline": "From buying intent to authorized action.",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
