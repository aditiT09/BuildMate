from pydantic import BaseModel


class OpportunityCreate(BaseModel):
    role: str
    project_id: int
    seats: int
    status: str
    required_skills: list[int] = []


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
    skills: list[OpportunitySkillResponse] = []

    class Config:
        from_attributes = True