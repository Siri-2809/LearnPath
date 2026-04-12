"""
recommendation_service.py

This service generates personalized learning resource recommendations
based on identified weak subjects. It utilizes the trained ML model and
falls back to a rule-based system if the model is unavailable.

Author: LearnPath
"""

from typing import List, Dict, Any

from app.models.predict import recommend_resources


# Rule-based fallback recommendations
RESOURCE_MAP = {
    "DSA": [
        "GeeksforGeeks - Data Structures and Algorithms",
        "LeetCode Practice Problems",
        "Cracking the Coding Interview",
        "Coursera - Algorithms Specialization"
    ],
    "DBMS": [
        "GeeksforGeeks - DBMS Tutorials",
        "NPTEL - Database Management Systems",
        "MySQL Documentation",
        "Stanford Database Courses"
    ],
    "OS": [
        "Operating System Concepts by Silberschatz",
        "GeeksforGeeks - Operating Systems",
        "NPTEL - Operating Systems",
        "Linux Command Line Tutorials"
    ],
    "CN": [
        "Computer Networking by Kurose and Ross",
        "GeeksforGeeks - Computer Networks",
        "Cisco Networking Basics",
        "NPTEL - Computer Networks"
    ],
    "OOP": [
        "Head First Object-Oriented Analysis and Design",
        "GeeksforGeeks - Object-Oriented Programming",
        "Java Programming Masterclass",
        "C++ OOP Tutorials"
    ],
    "Aptitude": [
        "IndiaBix Aptitude Questions",
        "RS Aggarwal Quantitative Aptitude",
        "PrepInsta Aptitude Preparation",
        "GeeksforGeeks Aptitude Practice"
    ],
    "System Design": [
        "Grokking the System Design Interview",
        "System Design Primer (GitHub)",
        "Designing Data-Intensive Applications",
        "High Scalability Blog"
    ]
}


def get_rule_based_recommendations(weak_subjects: List[str]) -> List[Dict[str, Any]]:
    """
    Generate recommendations using a rule-based approach.

    Args:
        weak_subjects (List[str]): List of weak subjects.

    Returns:
        List[Dict[str, Any]]: Structured recommendations.
    """
    recommendations = []

    for subject in weak_subjects:
        resources = RESOURCE_MAP.get(subject, [])
        for resource in resources:
            recommendations.append({
                "subject": subject,
                "resource": resource,
                "type": "Course/Article",
                "priority": "High"
            })

    return recommendations


def generate_recommendations(weak_subjects: List[str]) -> Dict[str, Any]:
    """
    Generate personalized recommendations using ML or fallback logic.

    Args:
        weak_subjects (List[str]): List of weak subjects.

    Returns:
        Dict[str, Any]: Recommendation results.
    """
    try:
        if not weak_subjects:
            return {
                "success": True,
                "recommendations": [],
                "message": "No weak subjects identified. Great job!"
            }

        # Attempt ML-based recommendations
        try:
            ml_output = recommend_resources(weak_subjects)
            ml_recommendations = ml_output.get("recommendations", [])

            structured_recommendations = []
            for item in ml_recommendations:
                structured_recommendations.append({
                    "subject": "General",
                    "resource": item,
                    "type": "ML Recommended",
                    "priority": "High"
                })

            # If ML model returns meaningful results
            if structured_recommendations:
                return {
                    "success": True,
                    "recommendations": structured_recommendations,
                    "message": "ML-based recommendations generated successfully."
                }

        except Exception:
            # Fallback to rule-based system
            pass

        # Rule-based fallback recommendations
        fallback_recommendations = get_rule_based_recommendations(weak_subjects)

        return {
            "success": True,
            "recommendations": fallback_recommendations,
            "message": "Rule-based recommendations generated successfully."
        }

    except Exception as error:
        return {
            "success": False,
            "recommendations": [],
            "error": str(error),
            "message": "Failed to generate recommendations."
        }