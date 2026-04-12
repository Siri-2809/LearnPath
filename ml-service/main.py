from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Environment configurations
API_TITLE = os.getenv("API_TITLE", "LearnPath ML Service")
API_DESCRIPTION = os.getenv(
    "API_DESCRIPTION",
    "Machine Learning Microservice for Skill Gap Analysis and Recommendations"
)
API_VERSION = os.getenv("API_VERSION", "1.0.0")
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))

# Initialize FastAPI app
app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION,
    debug=DEBUG,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {"name": "Health", "description": "Service health and status endpoints"},
        {"name": "Skill Gap Analysis", "description": "Analyze user performance and identify weak subjects"},
        {"name": "Recommendations", "description": "Generate personalized learning recommendations"},
    ],
)

# Configure CORS
cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from app.routes.skill_gap_routes import router as skill_gap_router
from app.routes.recommendation_routes import router as recommendation_router

# Include routers
app.include_router(
    skill_gap_router,
    prefix="/skill-gap",
    tags=["Skill Gap Analysis"]
)

app.include_router(
    recommendation_router,
    prefix="/recommend",
    tags=["Recommendations"]
)


# Root endpoint
@app.get("/", tags=["Health"])
def root():
    return {
        "message": "LearnPath ML Service is running successfully!",
        "status": "active",
        "version": API_VERSION,
        "environment": ENVIRONMENT,
    }


# Health check endpoint
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": API_TITLE,
        "version": API_VERSION,
        "environment": ENVIRONMENT,
    }


# Startup event
@app.on_event("startup")
def startup_event():
    print(f"🚀 {API_TITLE} is starting...")
    print(f"🌐 Environment: {ENVIRONMENT}")
    print(f"📄 Documentation: http://localhost:{PORT}/docs")


# Run the application directly
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        reload=DEBUG,
    )