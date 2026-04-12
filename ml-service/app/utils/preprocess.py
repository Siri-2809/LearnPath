"""
Preprocessing utilities for the LearnPath ML Service.

This module handles:
- Data cleaning
- Feature preparation
- Normalization
- Input transformation for model prediction
"""

import pandas as pd
import numpy as np


def load_dataset(file_path: str) -> pd.DataFrame:
    """
    Load the training dataset from a CSV file.

    Args:
        file_path (str): Path to the CSV file.

    Returns:
        pd.DataFrame: Loaded dataset.
    """
    try:
        df = pd.read_csv(file_path)
        return df
    except Exception as e:
        raise RuntimeError(f"Error loading dataset: {e}")


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean the dataset by removing duplicates and handling missing values.

    Args:
        df (pd.DataFrame): Raw dataset.

    Returns:
        pd.DataFrame: Cleaned dataset.
    """
    df = df.copy()

    # Remove duplicate rows
    df.drop_duplicates(inplace=True)

    # Handle missing numeric values
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        df[col].fillna(df[col].mean(), inplace=True)

    # Handle missing categorical values
    categorical_cols = df.select_dtypes(include=["object"]).columns
    for col in categorical_cols:
        df[col].fillna("Unknown", inplace=True)

    return df


def normalize_scores(scores: dict) -> dict:
    """
    Normalize scores to a range of 0–1.

    Args:
        scores (dict): Dictionary of subject scores.

    Returns:
        dict: Normalized scores.
    """
    if not scores:
        return {}

    max_score = max(scores.values())
    if max_score == 0:
        return {k: 0 for k in scores}

    return {k: round(v / max_score, 4) for k, v in scores.items()}


def prepare_training_data(
    df: pd.DataFrame, target_column: str = "label"
):
    """
    Prepare features and labels for model training.

    Args:
        df (pd.DataFrame): Clean dataset.
        target_column (str): Name of the target column.

    Returns:
        tuple: Features (X) and labels (y).
    """
    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' not found in dataset.")

    X = df.drop(columns=[target_column])
    y = df[target_column]

    # Convert categorical columns into numerical using one-hot encoding
    X = pd.get_dummies(X, drop_first=True)

    return X, y


def preprocess_input(scores: dict) -> pd.DataFrame:
    """
    Convert input scores dictionary into a DataFrame suitable for prediction.

    Args:
        scores (dict): Example:
            {
                "DSA": 70,
                "DBMS": 60,
                "OS": 50,
                "CN": 80,
                "OOP": 75,
                "Aptitude": 65
            }

    Returns:
        pd.DataFrame: Preprocessed input.
    """
    if not scores:
        raise ValueError("Input scores dictionary cannot be empty.")

    # Normalize scores
    normalized_scores = normalize_scores(scores)

    # Convert to DataFrame
    df = pd.DataFrame([normalized_scores])

    # Ensure consistent column ordering
    expected_columns = [
        "DSA",
        "DBMS",
        "OS",
        "CN",
        "OOP",
        "Aptitude",
        "System Design",
    ]

    for col in expected_columns:
        if col not in df.columns:
            df[col] = 0

    df = df[expected_columns]

    return df


def identify_weak_subjects(scores: dict, threshold: float = 0.6) -> list:
    """
    Identify weak subjects based on a threshold.

    Args:
        scores (dict): Dictionary of subject scores.
        threshold (float): Threshold below which a subject is considered weak.

    Returns:
        list: Weak subjects.
    """
    if not scores:
        return []

    normalized_scores = normalize_scores(scores)

    weak_subjects = [
        subject
        for subject, score in normalized_scores.items()
        if score < threshold
    ]

    return weak_subjects


def identify_strong_subjects(scores: dict, threshold: float = 0.75) -> list:
    """
    Identify strong subjects based on a threshold.

    Args:
        scores (dict): Dictionary of subject scores.
        threshold (float): Threshold above which a subject is considered strong.

    Returns:
        list: Strong subjects.
    """
    if not scores:
        return []

    normalized_scores = normalize_scores(scores)

    strong_subjects = [
        subject
        for subject, score in normalized_scores.items()
        if score >= threshold
    ]

    return strong_subjects


def calculate_average_score(scores: dict) -> float:
    """
    Calculate the average score across all subjects.

    Args:
        scores (dict): Dictionary of subject scores.

    Returns:
        float: Average score.
    """
    if not scores:
        return 0.0

    return round(sum(scores.values()) / len(scores), 2)


def categorize_performance(average_score: float) -> str:
    """
    Categorize overall performance based on average score.

    Args:
        average_score (float): Average score.

    Returns:
        str: Performance category.
    """
    if average_score >= 85:
        return "Excellent"
    elif average_score >= 70:
        return "Good"
    elif average_score >= 50:
        return "Average"
    else:
        return "Needs Improvement"