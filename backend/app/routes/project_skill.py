from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.project_skill import (
    ProjectSkill
)

from app.schemas.project_skill import (
    ProjectSkillCreate
)
from app.utils.redis_client import redis_client

router = APIRouter(

    prefix="/project-skills",

    tags=["Project Skills"]

)


@router.post("/")
def add_project_skill(

    data: ProjectSkillCreate,

    db: Session = Depends(
        get_db
    )

):

    existing = (

        db.query(ProjectSkill)

        .filter(

            ProjectSkill.project_id
            ==
            data.project_id,

            ProjectSkill.skill_id
            ==
            data.skill_id

        )

        .first()

    )

    if existing:

        return {

            "message":

            "Already added"

        }

    project_skill = ProjectSkill(

        project_id=
        data.project_id,

        skill_id=
        data.skill_id

    )

    db.add(
        project_skill
    )

    db.commit()
    redis_client.flushall()

    db.refresh(
        project_skill
    )

    return project_skill


@router.get("/")
def get_project_skills(

    db: Session =
    Depends(get_db)

):

    return (

        db.query(
            ProjectSkill
        )

        .all()

    )