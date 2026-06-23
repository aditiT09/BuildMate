from sqlalchemy.orm import Session, joinedload

from app.models.application import Application
from app.models.opportunity import Opportunity
from app.models.project import Project
from app.models.user import User


def rank_applicants(
    opportunity_id: int,
    db: Session
):
    opportunity = (
        db.query(Opportunity)
        .options(joinedload(Opportunity.project).joinedload(Project.skills))
        .filter(
            Opportunity.id == opportunity_id
        )
        .first()
    )

    if not opportunity:
        return []

    project = opportunity.project
    if not project:
        return []

    project_skill_ids = {
        skill.skill_id
        for skill in project.skills
    }

    applications = (
        db.query(Application)
        .options(joinedload(Application.user).joinedload(User.skills))
        .filter(
            Application.opportunity_id
            == opportunity_id
        )
        .all()
    )

    rankings = []

    for application in applications:
        user = application.user
        if not user:
            continue

        user_skill_ids = {
            skill.skill_id
            for skill in user.skills
        }

        common_skills = len(
            project_skill_ids &
            user_skill_ids
        )

        if len(project_skill_ids) == 0:
            skill_match = 0
        else:
            skill_match = round(
                (
                    common_skills
                    / len(project_skill_ids)
                ) * 100,
                2
            )

        activity_score = (
            50
            if user.activity_score is None
            else user.activity_score
        )

        reliability_score = (
            50
            if user.reliability_score is None
            else user.reliability_score
        )

        overall_score = round(
            (
                skill_match * 0.70
            )
            +
            (
                activity_score * 0.15
            )
            +
            (
                reliability_score * 0.15
            ),
            2
        )

        rankings.append({
            "application_id": application.id,
            "user_id": user.id,
            "name": user.name,
            "status": application.status,
            "skill_match": skill_match,
            "activity_score": activity_score,
            "reliability_score": reliability_score,
            "overall_score": overall_score,
        })

    rankings.sort(
        key=lambda x: x["overall_score"],
        reverse=True
    )

    return rankings