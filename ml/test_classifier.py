import joblib

model = joblib.load("ml/ticket_classifier.pkl")
vectorizer = joblib.load("ml/vectorizer.pkl")

test_tickets = [
    "My Wi-Fi is not working",
    "I forgot my password",
    "My keyboard is broken",
    "Microsoft Word keeps crashing",
    "I received a suspicious email"
]

for ticket in test_tickets:
    ticket_vector = vectorizer.transform([ticket])
    prediction = model.predict(ticket_vector)[0]

    print(f"{ticket} -> {prediction}")