from pathlib import Path

import joblib


# Project root folder
PROJECT_ROOT = Path(__file__).resolve().parents[2]

# ML model paths
MODEL_PATH = PROJECT_ROOT / "ml" / "ticket_classifier.pkl"
VECTORIZER_PATH = PROJECT_ROOT / "ml" / "vectorizer.pkl"


# Load model and vectorizer
model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)


def predict_category(title: str, description: str) -> str:
    ticket_text = f"{title} {description}"

    ticket_vector = vectorizer.transform(
        [ticket_text]
    )

    prediction = model.predict(
        ticket_vector
    )[0]

    return prediction