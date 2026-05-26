from pydantic import BaseModel


class UserSkillCreate(
    BaseModel
):

    skill_id: int