from pydantic import BaseModel


class OpportunitySkillCreate(BaseModel):
    opportunity_id: int
    skill_id: int
