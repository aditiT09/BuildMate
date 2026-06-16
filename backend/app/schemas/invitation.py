from pydantic import BaseModel
from typing import Optional


class UserInfo(BaseModel):
    id: int
    name: str
    bio: Optional[str] = None

    class Config:
        from_attributes = True


class ProjectInfo(BaseModel):
    id: int
    title: str
    description: str
    project_type: str

    class Config:
        from_attributes = True


class OpportunityInfo(BaseModel):
    id: int
    role: str
    project_id: int
    seats: int
    status: str
    project: ProjectInfo

    class Config:
        from_attributes = True


class InvitationCreate(BaseModel):
    user_id: int
    opportunity_id: int


class InvitationResponse(BaseModel):
    id: int
    user_id: int
    opportunity_id: int
    status: str
    user: UserInfo
    opportunity: OpportunityInfo

    class Config:
        from_attributes = True


class InvitationRespond(BaseModel):
    status: str  # accepted or rejected
