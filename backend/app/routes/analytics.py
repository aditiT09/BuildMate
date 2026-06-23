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

    # 1. Query total user/project/opportunity counts in a single trip using scalar subqueries
    total_users_sub = db.query(func.count(User.id)).scalar_subquery()
    total_projects_sub = db.query(func.count(Project.id)).scalar_subquery()
    total_opportunities_sub = db.query(func.count(Opportunity.id)).scalar_subquery()
    counts = db.query(total_users_sub, total_projects_sub, total_opportunities_sub).first()
    total_users, total_projects, total_opportunities = counts if counts else (0, 0, 0)

    # 2. Query application counts grouped by status in a single trip
    status_counts = (
        db.query(
            Application.status,
            func.count(Application.id).label("count")
        )
        .group_by(Application.status)
        .all()
    )

    accepted_apps = 0
    rejected_apps = 0
    pending_apps = 0
    total_apps = 0

    for status, count in status_counts:
        total_apps += count
        if status == "accepted":
            accepted_apps = count
        elif status == "rejected":
            rejected_apps = count
        elif status == "pending":
            pending_apps = count

    return {

        "total_users": total_users,

        "total_projects": total_projects,

        "total_opportunities": total_opportunities,

        "total_applications": total_apps,

        "accepted_applications": accepted_apps,

        "rejected_applications": rejected_apps,

        "pending_applications": pending_apps,

        "top_skills": [
            {
                "name": skill.name,
                "count": skill.count
            }
            for skill in top_skills
        ]

    }