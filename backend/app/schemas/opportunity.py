from pydantic import BaseModel, Field
from enum import Enum


class OpportunityStatus(str, Enum):
    OPEN = "open"
    CLOSED = "closed"

class OpportunityCreate(BaseModel):
    role: str = Field(..., min_length=2, max_length=100)
    project_id: int = Field(..., gt=0)
    seats: int = Field(..., ge=1, le=100)
    status: OpportunityStatus
    required_skills: list[int] = Field(default_factory=list)


class SkillInfo(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class OpportunitySkillResponse(BaseModel):
    id: int
    skill_id: int
    skill: SkillInfo

    class Config:
        from_attributes = True


class OpportunityResponse(BaseModel):
    id: int
    role: str
    project_id: int
    seats: int
    status: str
    skills: list[OpportunitySkillResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True