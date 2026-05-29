from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    opportunity_id: int


class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    opportunity_id: int
    status: str

    class Config:
        from_attributes = True