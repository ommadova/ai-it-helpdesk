from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models
from .database import SessionLocal, engine
from .ml_service import predict_category
from .schemas import TicketCreate, TicketResponse, TicketUpdate,  TicketActivityResponse



models.Base.metadata.create_all(bind=engine)


app = FastAPI(title="AI IT Helpdesk API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "AI IT Helpdesk API is running"}


# Create a ticket
@app.post("/tickets", response_model=TicketResponse)
def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db)
):
    predicted_category = predict_category(
        ticket.title,
        ticket.description
    )

    new_ticket = models.Ticket(
        title=ticket.title,
        description=ticket.description,
        category=predicted_category
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    created_activity = models.TicketActivity(
        ticket_id=new_ticket.id,
        action="Ticket created"
    )

    classification_activity = models.TicketActivity(
        ticket_id=new_ticket.id,
        action=f"AI classified ticket as {predicted_category}"
    )

    db.add(created_activity)
    db.add(classification_activity)
    db.commit()

    return new_ticket


# Get all tickets
@app.get("/tickets", response_model=list[TicketResponse])
def get_tickets(
    db: Session = Depends(get_db)
):
    return db.query(models.Ticket).all()


# Get one ticket
@app.get("/tickets/{ticket_id}", response_model=TicketResponse)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):
    ticket = db.query(models.Ticket).filter(
        models.Ticket.id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    return ticket


# Update ticket status
@app.put("/tickets/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: int,
    ticket_update: TicketUpdate,
    db: Session = Depends(get_db)
):
    ticket = db.query(models.Ticket).filter(
        models.Ticket.id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    old_status = ticket.status

    ticket.status = ticket_update.status

    db.commit()
    db.refresh(ticket)

    if old_status != ticket.status:
     activity = models.TicketActivity(
        ticket_id=ticket.id,
        action=f"Status changed from {old_status} to {ticket.status}"
    )

    db.add(activity)
    db.commit()

    return ticket

@app.get(
    "/tickets/{ticket_id}/activities",
    response_model=list[TicketActivityResponse]
)
def get_ticket_activities(
    ticket_id: int,
    db: Session = Depends(get_db)
):
    activities = (
        db.query(models.TicketActivity)
        .filter(models.TicketActivity.ticket_id == ticket_id)
        .order_by(models.TicketActivity.created_at.asc())
        .all()
    )

    return activities