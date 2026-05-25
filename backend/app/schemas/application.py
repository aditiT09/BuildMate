from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    user_id: int
    opportunity_id: int
    status: str = "pending"


class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    opportunity_id: int
    status: str

    class Config:
        from_attributes = True