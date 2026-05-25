from pydantic import BaseModel


class OpportunityCreate(BaseModel):
    role: str
    project_id: int
    seats: int
    status: str


class OpportunityResponse(BaseModel):
    id: int
    role: str
    project_id: int
    seats: int
    status: str

    class Config:
        from_attributes = True