from pydantic import BaseModel


class TicketCreate(BaseModel):
    title: str
    description: str


class TicketUpdate(BaseModel):
    status: str


class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str | None = None
    priority: str | None = None
    status: str

    class Config:
        from_attributes = True