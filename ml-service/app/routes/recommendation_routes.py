"""
recommendation_routes.py

This module defines API routes for generating personalized learning
recommendations based on weak subjects.

Author: LearnPath
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict

from app.services.recommendation_service import generate_recommendations

# Initialize router
router = APIRouter()


# ================================
# Request & Response Schemas
# ================================

class RecommendationRequest(BaseModel):
    """
    Schema for recommendation request.
    """
    weak_subjects: List[str] = Field(
        ...,
        example=["DSA", "Operating Systems"]
    )


class RecommendationItem(BaseModel):
    """
    Schema for an individual recommendation.
    """
    subject: str
    resource: str
    type: str
    priority: str


class RecommendationResponse(BaseModel):
    """
    Schema for recommendation response.
    """
    success: bool
    recommendations: List[RecommendationItem]
    message: str


# ================================
# Routes
# ================================

@router.post("/", response_model=RecommendationResponse)
def get_recommendations(request: RecommendationRequest):
    """
    Generate personalized recommendations based on weak subjects.

    Endpoint:
        POST /recommend/

    Request Body:
        {
            "weak_subjects": ["DSA", "OS"]
        }

    Returns:
        - Recommended resources
        - Priority and type of each resource
    """
    try:
        result = generate_recommendations(request.weak_subjects)

        if not result.get("success"):
            raise HTTPException(
                status_code=400,
                detail=result.get("error", "Failed to generate recommendations.")
            )

        return result

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(exc)}"
        )


@router.get("/health")
def recommendation_health_check() -> Dict[str, str]:
    """
    Health check endpoint for the Recommendation service.
    """
    return {
        "status": "healthy",
        "service": "Recommendation API"
    }