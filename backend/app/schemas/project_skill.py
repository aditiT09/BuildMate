from pydantic import BaseModel


class ProjectSkillCreate(
    BaseModel
):

    project_id: int

    skill_id: int