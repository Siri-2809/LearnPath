"""
skill_gap_routes.py

This module defines API routes for skill gap analysis.
It processes user scores and returns insights such as weak subjects,
strong subjects, average score, and overall performance.

Author: LearnPath
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List

from app.services.skill_gap_service import analyze_skill_gap

# Initialize router
router = APIRouter()


# ================================
# Request & Response Schemas
# ================================

class SkillGapRequest(BaseModel):
    """
    Schema for skill gap analysis request.
    Accepts subject-wise scores.
    """
    scores: Dict[str, float] = Field(
        ...,
        example={
            "DSA": 65,
            "DBMS": 70,
            "OS": 45,
            "CN": 60,
            "OOP": 80,
            "Aptitude": 55,
            "System Design": 50
        }
    )


class SkillGapResponse(BaseModel):
    """
    Schema for skill gap analysis response.
    """
    success: bool
    scores: Dict[str, float]
    average_score: float
    performance: str
    weak_subjects: List[str]
    strong_subjects: List[str]
    message: str


# ================================
# Routes
# ================================

@router.post("/", response_model=SkillGapResponse)
def get_skill_gap_analysis(request: SkillGapRequest):
    """
    Analyze skill gaps based on user scores.

    Returns:
        - Weak Subjects
        - Strong Subjects
        - Average Score
        - Overall Performance
    """
    try:
        result = analyze_skill_gap(request.scores)

        if not result.get("success"):
            raise HTTPException(status_code=400, detail=result.get("error"))

        return result

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(exc)}"
        )


@router.get("/health")
def skill_gap_health_check():
    """
    Health check endpoint for the Skill Gap service.
    """
    return {
        "status": "healthy",
        "service": "Skill Gap Analysis API"
    }