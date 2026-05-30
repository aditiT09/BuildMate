from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db

from app.models.user import User
from app.models.project import Project
from app.models.opportunity import Opportunity
from app.models.application import Application
from app.models.skill import Skill
from app.models.user_skill import UserSkill


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/overview")
def get_overview(
    db: Session = Depends(get_db)
):

    top_skills = (

        db.query(
            Skill.name,
            func.count(
                UserSkill.id
            ).label("count")
        )

        .join(
            UserSkill,
            Skill.id == UserSkill.skill_id
        )

        .group_by(
            Skill.id
        )

        .order_by(
            func.count(
                UserSkill.id
            ).desc()
        )

        .limit(5)

        .all()
    )

    return {

        "total_users":
        db.query(User).count(),

        "total_projects":
        db.query(Project).count(),

        "total_opportunities":
        db.query(Opportunity).count(),

        "total_applications":
        db.query(Application).count(),

        "accepted_applications":

        db.query(Application)

        .filter(
            Application.status
            == "accepted"
        )

        .count(),

        "rejected_applications":

        db.query(Application)

        .filter(
            Application.status
            == "rejected"
        )

        .count(),

        "pending_applications":

        db.query(Application)

        .filter(
            Application.status
            == "pending"
        )

        .count(),

        "top_skills": [

            skill.name

            for skill in top_skills

        ]

    }