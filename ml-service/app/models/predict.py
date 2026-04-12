"""
predict.py

This module loads trained machine learning models and provides
prediction utilities for:

1. Skill Gap Analysis
2. Resource Recommendation
"""

import os
import joblib
import pandas as pd
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Model paths from environment variables
SKILL_GAP_MODEL_PATH = os.getenv(
    "SKILL_GAP_MODEL_PATH", "trained_models/skill_gap_model.pkl"
)
RECOMMENDATION_MODEL_PATH = os.getenv(
    "RECOMMENDATION_MODEL_PATH",
    "trained_models/recommendation_model.pkl",
)

# Subject columns expected by the model
FEATURE_COLUMNS = [
    "DSA",
    "DBMS",
    "OS",
    "CN",
    "OOP",
    "Aptitude",
    "System Design",
]

# Global variables to cache loaded models
_skill_gap_model_data = None
_recommendation_model_data = None


# ================================
# Model Loading Functions
# ================================

def load_skill_gap_model():
    """Load the skill gap prediction model."""
    global _skill_gap_model_data

    if _skill_gap_model_data is None:
        if not os.path.exists(SKILL_GAP_MODEL_PATH):
            raise FileNotFoundError(
                f"Skill gap model not found at {SKILL_GAP_MODEL_PATH}. "
                "Please train the model first."
            )

        _skill_gap_model_data = joblib.load(SKILL_GAP_MODEL_PATH)

    return _skill_gap_model_data


def load_recommendation_model():
    """Load the recommendation model."""
    global _recommendation_model_data

    if _recommendation_model_data is None:
        if not os.path.exists(RECOMMENDATION_MODEL_PATH):
            raise FileNotFoundError(
                f"Recommendation model not found at {RECOMMENDATION_MODEL_PATH}. "
                "Please train the model first."
            )

        _recommendation_model_data = joblib.load(
            RECOMMENDATION_MODEL_PATH
        )

    return _recommendation_model_data


# ================================
# Utility Functions
# ================================

def prepare_feature_dataframe(scores: dict) -> pd.DataFrame:
    """
    Convert a scores dictionary into a DataFrame suitable for prediction.

    Args:
        scores (dict): Dictionary containing subject scores.

    Returns:
        pd.DataFrame: Model-ready DataFrame.
    """
    data = {}

    for column in FEATURE_COLUMNS:
        data[column] = [scores.get(column, 0)]

    return pd.DataFrame(data)


# ================================
# Prediction Functions
# ================================

def predict_skill_gap(scores: dict) -> dict:
    """
    Predict weak subjects based on user scores.

    Args:
        scores (dict): Subject-wise scores.

    Returns:
        dict: Predicted weak subjects.
    """
    model_data = load_skill_gap_model()
    model = model_data["model"]
    mlb = model_data["mlb"]

    X = prepare_feature_dataframe(scores)
    prediction = model.predict(X)

    weak_subjects = mlb.inverse_transform(prediction)
    weak_subjects = list(weak_subjects[0]) if weak_subjects else []

    return {
        "weak_subjects": weak_subjects
    }


def recommend_resources(weak_subjects: list) -> dict:
    """
    Recommend resources based on weak subjects.

    Args:
        weak_subjects (list): List of weak subjects.

    Returns:
        dict: Recommended resources.
    """
    model_data = load_recommendation_model()
    model = model_data["model"]
    mlb_X = model_data["mlb_X"]
    mlb_y = model_data["mlb_y"]

    # Transform input subjects
    X = mlb_X.transform([weak_subjects])
    prediction = model.predict(X)

    recommendations = mlb_y.inverse_transform(prediction)
    recommendations = list(recommendations[0]) if recommendations else []

    return {
        "recommendations": recommendations
    }


def predict_full_analysis(scores: dict) -> dict:
    """
    Perform full analysis including skill gap and recommendations.

    Args:
        scores (dict): Subject-wise scores.

    Returns:
        dict: Complete analysis.
    """
    skill_gap_result = predict_skill_gap(scores)
    weak_subjects = skill_gap_result["weak_subjects"]

    recommendation_result = recommend_resources(weak_subjects)

    average_score = round(
        sum(scores.values()) / len(scores), 2
    ) if scores else 0

    return {
        "scores": scores,
        "average_score": average_score,
        "weak_subjects": weak_subjects,
        "recommendations": recommendation_result["recommendations"],
    }


# ================================
# Test Script (Optional)
# ================================

if __name__ == "__main__":
    sample_scores = {
        "DSA": 45,
        "DBMS": 60,
        "OS": 40,
        "CN": 70,
        "OOP": 80,
        "Aptitude": 55,
        "System Design": 50,
    }

    print("\n🔍 Running Sample Prediction...\n")
    result = predict_full_analysis(sample_scores)
    print(result)