from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User
from app.models.project import Project

from app.utils.security import (
    get_current_user
)


router = APIRouter(

    prefix="/recommendations",

    tags=["Recommendations"]

)


@router.get(
    "/projects"
)
def recommended_projects(

    db: Session = Depends(
        get_db
    ),

    current_user = Depends(
        get_current_user
    )

):

    user_skill_ids = {

        user_skill.skill_id

        for user_skill in
        current_user.skills

    }

    projects = db.query(
        Project
    ).all()

    recommendations = []

    for project in projects:

        project_skill_ids = {

            project_skill.skill_id

            for project_skill
            in project.skills

        }

        common_skills = len(

            user_skill_ids
            &
            project_skill_ids

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
                * 100,

                2
            )

       
        if score > 0:

            recommendations.append({

                "project_id":
                project.id,

                "title":
                project.title,

                "match_score":
                score

            
        })

    recommendations.sort(

        key=lambda x:
        x["match_score"],

        reverse=True

    )

    return recommendations
