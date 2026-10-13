from fastapi import FastAPI

app = FastAPI(title="AI IT Helpdesk API")


@app.get("/")
def home():
    return {
        "message": "AI IT Helpdesk API is running"
    }