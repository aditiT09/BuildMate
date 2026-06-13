from pydantic import BaseModel


class ProjectCreate(BaseModel):

    problem: str = ""

    goal: str = ""

    tech_stack: str = ""

    current_progress: str = ""

    contribution_guide: str = ""
    


class ProjectResponse(BaseModel):

    problem: str | None

    goal: str | None

    tech_stack: str | None

    current_progress: str | None

    contribution_guide: str | None

    class Config:

        from_attributes = True