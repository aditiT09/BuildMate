from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.user import User


def get_best_candidates(
    project_id: int,
    db: Session
):

    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        return []

    project_skill_ids = {
        skill.skill_id
        for skill in project.skills
    }

    users = db.query(User).all()

    rankings = []

    for user in users:

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
                    common_skills /
                    len(project_skill_ids)
                ) * 100,
                2
            )

        activity_score = user.activity_score or 50

        reliability_score = user.reliability_score or 50

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

            "user_id": user.id,

            "name": user.name,

            "skill_match": skill_match,

           "activity_score":
            activity_score,

           "reliability_score":
            reliability_score,
            "overall_score":
            overall_score

        })

    rankings.sort(

        key=lambda x:
        x["overall_score"],

        reverse=True

    )

    return rankings