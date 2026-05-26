from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.project import Project
from app.models.user import User


router = APIRouter(
    prefix="/matching",
    tags=["Matching"]
)


@router.get(
    "/projects/{project_id}/matches"
)
def get_matches(
    project_id: int,
    db: Session = Depends(get_db)
):

    project = db.query(
        Project
    ).filter(
        Project.id == project_id
    ).first()

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    project_skill_ids = {

        project_skill.skill_id

        for project_skill in project.skills

    }

    users = db.query(
        User
    ).all()

    matches = []

    for user in users:

        user_skill_ids = {

            user_skill.skill_id

            for user_skill in user.skills

        }

        common_skills = len(

            project_skill_ids
            &
            user_skill_ids

        )

        total_project_skills = len(
            project_skill_ids
        )

        if total_project_skills == 0:

            score = 0

        else:

            score = round(

                (
                    common_skills
                    /
                    total_project_skills
                )
                *
                100,

                2
            )

        matches.append({

            "user_id": user.id,

            "name": user.name,

            "match_score": score

        })

    matches.sort(

        key=lambda x:
        x["match_score"],

        reverse=True

    )

    return matches