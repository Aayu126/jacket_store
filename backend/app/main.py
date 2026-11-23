from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import engine, Base
from app.routers import auth_router, products_router, orders_router, users_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create all tables in MySQL if they do not exist yet
    try:
        Base.metadata.create_all(bind=engine)
        print("✓ MySQL tables verified / created successfully.")
    except Exception as e:
        print(f"⚠ Database connection warning: {e}")
        print("Please ensure your MySQL server is running and database exists.")
    yield


app = FastAPI(
    title="Suedo Atelier API",
    description="High-performance backend for Suedo Jacket Store built with FastAPI, SQLAlchemy & MySQL.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Enable CORS for Vite dev server & production Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(orders_router)
app.include_router(users_router)


@app.get("/", tags=["System"])
def root():
    return {
        "atelier": "Suedo Atelier Florence",
        "service": "FastAPI + MySQL Backend",
        "status": "Operational",
        "documentation": "/docs"
    }


@app.get("/health", tags=["System"])
def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}
