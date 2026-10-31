import pandas as pd
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
)
from sklearn.model_selection import train_test_split


# Load dataset
data = pd.read_csv("dataset/tickets.csv")

print("Dataset loaded successfully")
print(data.head())

# Input text
X = data["text"]

# Category labels
y = data["category"]


# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.30,
    random_state=42,
    stratify=y
)


# Convert ticket text into numbers
vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english"
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)


# Create classifier
model = LogisticRegression(
    max_iter=1000
)


# Train classifier
model.fit(
    X_train_tfidf,
    y_train
)


# Make predictions
predictions = model.predict(
    X_test_tfidf
)


# Evaluate model
accuracy = accuracy_score(
    y_test,
    predictions
)

print("\nAccuracy:")
print(accuracy)

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        predictions,
        zero_division=0
    )
)


# Save model
joblib.dump(
    model,
    "ml/ticket_classifier.pkl"
)

joblib.dump(
    vectorizer,
    "ml/vectorizer.pkl"
)

print("\nModel saved successfully.")