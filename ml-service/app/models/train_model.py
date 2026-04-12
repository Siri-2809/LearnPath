"""
train_model.py

This module trains and saves machine learning models for the LearnPath ML Service.
It builds:
1. Skill Gap Prediction Model
2. Recommendation Model

Both models are saved in the trained_models directory.
"""

import os
import joblib
import pandas as pd
from dotenv import load_dotenv
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics import accuracy_score, classification_report

from app.utils.preprocess import load_dataset, clean_data

# Load environment variables
load_dotenv()

# Paths from environment variables
TRAINING_DATA_PATH = os.getenv(
    "TRAINING_DATA_PATH", "data/training_data.csv"
)
SKILL_GAP_MODEL_PATH = os.getenv(
    "SKILL_GAP_MODEL_PATH", "trained_models/skill_gap_model.pkl"
)
RECOMMENDATION_MODEL_PATH = os.getenv(
    "RECOMMENDATION_MODEL_PATH",
    "trained_models/recommendation_model.pkl",
)

RANDOM_STATE = int(os.getenv("MODEL_RANDOM_STATE", 42))


def ensure_directories():
    """Ensure that required directories exist."""
    os.makedirs(os.path.dirname(SKILL_GAP_MODEL_PATH), exist_ok=True)
    os.makedirs(os.path.dirname(RECOMMENDATION_MODEL_PATH), exist_ok=True)


def train_skill_gap_model(df: pd.DataFrame):
    """
    Train a multi-label classification model to identify weak subjects.

    Expected Columns:
        - DSA, DBMS, OS, CN, OOP, Aptitude, System Design
        - weak_subjects (comma-separated string)
    """
    print("\n📘 Training Skill Gap Model...")

    feature_columns = [
        "DSA",
        "DBMS",
        "OS",
        "CN",
        "OOP",
        "Aptitude",
        "System Design",
    ]

    target_column = "weak_subjects"

    # Validate dataset
    missing_features = [col for col in feature_columns if col not in df.columns]
    if missing_features:
        raise ValueError(f"Missing feature columns: {missing_features}")

    if target_column not in df.columns:
        raise ValueError(f"Missing target column: '{target_column}'")

    X = df[feature_columns]

    # Convert comma-separated labels into lists
    y_raw = df[target_column].apply(
        lambda x: [s.strip() for s in str(x).split(",")]
    )

    mlb = MultiLabelBinarizer()
    y = mlb.fit_transform(y_raw)

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE
    )

    # Train model
    model = RandomForestClassifier(
        n_estimators=200,
        random_state=RANDOM_STATE
    )
    model.fit(X_train, y_train)

    # Evaluate model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"✅ Skill Gap Model Accuracy: {accuracy:.2f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    # Save model and label binarizer
    joblib.dump(
        {"model": model, "mlb": mlb},
        SKILL_GAP_MODEL_PATH
    )

    print(f"💾 Skill Gap Model saved at: {SKILL_GAP_MODEL_PATH}")


def train_recommendation_model(df: pd.DataFrame):
    """
    Train a recommendation model based on weak subjects.

    Expected Columns:
        - weak_subjects
        - recommended_resources
    """
    print("\n📗 Training Recommendation Model...")

    if "weak_subjects" not in df.columns:
        raise ValueError("Dataset must contain 'weak_subjects' column.")

    if "recommended_resources" not in df.columns:
        raise ValueError("Dataset must contain 'recommended_resources' column.")

    X_raw = df["weak_subjects"].apply(
        lambda x: [s.strip() for s in str(x).split(",")]
    )
    y_raw = df["recommended_resources"].apply(
        lambda x: [s.strip() for s in str(x).split(",")]
    )

    mlb_X = MultiLabelBinarizer()
    mlb_y = MultiLabelBinarizer()

    X = mlb_X.fit_transform(X_raw)
    y = mlb_y.fit_transform(y_raw)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE
    )

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=RANDOM_STATE
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"✅ Recommendation Model Accuracy: {accuracy:.2f}")

    # Save model and encoders
    joblib.dump(
        {
            "model": model,
            "mlb_X": mlb_X,
            "mlb_y": mlb_y,
        },
        RECOMMENDATION_MODEL_PATH
    )

    print(f"💾 Recommendation Model saved at: {RECOMMENDATION_MODEL_PATH}")


def main():
    """Main function to train and save ML models."""
    print("🚀 Starting LearnPath ML Model Training...\n")

    ensure_directories()

    # Load and preprocess dataset
    df = load_dataset(TRAINING_DATA_PATH)
    df = clean_data(df)

    # Train models
    train_skill_gap_model(df)
    train_recommendation_model(df)

    print("\n🎉 All models trained successfully!")


if __name__ == "__main__":
    main()