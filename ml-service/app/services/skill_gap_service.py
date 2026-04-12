"""
skill_gap_service.py

This service handles skill gap analysis by leveraging the trained
machine learning model. It processes user scores, predicts weak areas,
and evaluates overall performance.

Author: LearnPath
"""

from typing import Dict, Any

from app.models.predict import predict_skill_gap
from app.utils.preprocess import (
    identify_weak_subjects,
    identify_strong_subjects,
    calculate_average_score,
    categorize_performance,
)

# Expected subjects for evaluation
EXPECTED_SUBJECTS = [
    "DSA",
    "DBMS",
    "OS",
    "CN",
    "OOP",
    "Aptitude",
    "System Design",
]


def validate_scores(scores: Dict[str, float]) -> Dict[str, float]:
    """
    Validate and sanitize input scores.

    Ensures:
    - All expected subjects are present.
    - Missing subjects are assigned a default score of 0.
    - Scores are numeric and within the range 0–100.

    Args:
        scores (Dict[str, float]): Input subject scores.

    Returns:
        Dict[str, float]: Validated and normalized scores.
    """
    if not isinstance(scores, dict) or not scores:
        raise ValueError("Scores must be a non-empty dictionary.")

    validated_scores = {}

    for subject in EXPECTED_SUBJECTS:
        value = scores.get(subject, 0)

        try:
            value = float(value)
        except (TypeError, ValueError):
            raise ValueError(f"Invalid score for '{subject}'. Must be numeric.")

        if value < 0 or value > 100:
            raise ValueError(
                f"Score for '{subject}' must be between 0 and 100."
            )

        validated_scores[subject] = round(value, 2)

    return validated_scores


def analyze_skill_gap(scores: Dict[str, float]) -> Dict[str, Any]:
    """
    Perform comprehensive skill gap analysis.

    This function:
    - Validates input scores
    - Predicts weak subjects using the ML model
    - Computes strong subjects
    - Calculates average performance
    - Categorizes user performance

    Args:
        scores (Dict[str, float]): Subject-wise scores.

    Returns:
        Dict[str, Any]: Skill gap analysis results.
    """
    try:
        # Step 1: Validate input scores
        validated_scores = validate_scores(scores)

        # Step 2: Predict weak subjects using ML model
        try:
            ml_result = predict_skill_gap(validated_scores)
            weak_subjects = ml_result.get("weak_subjects", [])
        except Exception:
            # Fallback to rule-based detection if ML model fails
            weak_subjects = identify_weak_subjects(validated_scores)

        # Step 3: Identify strong subjects
        strong_subjects = identify_strong_subjects(validated_scores)

        # Step 4: Calculate average score
        average_score = calculate_average_score(validated_scores)

        # Step 5: Categorize overall performance
        performance = categorize_performance(average_score)

        # Step 6: Prepare response
        return {
            "success": True,
            "scores": validated_scores,
            "average_score": average_score,
            "performance": performance,
            "weak_subjects": weak_subjects,
            "strong_subjects": strong_subjects,
            "message": "Skill gap analysis completed successfully."
        }

    except Exception as error:
        return {
            "success": False,
            "error": str(error),
            "message": "Failed to analyze skill gap."
        }