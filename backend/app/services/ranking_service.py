from sqlalchemy.orm import Session, joinedload

from app.models.project import Project
from app.models.user import User
from app.utils.redis_client import redis_client

import json


def get_best_candidates(
    project_id: int,
    db: Session
):
    cache_key = f"buildmate:project_rankings:{project_id}"

    try:
        cached_data = redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)
    except Exception as e:
        print("Redis Read Error (falling back to database):", e)

    project = (
        db.query(Project)
        .options(joinedload(Project.skills))
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        return []

    project_skill_ids = {
        skill.skill_id
        for skill in project.skills
    }

    users = db.query(User).options(joinedload(User.skills)).all()

    rankings = []

    for user in users:

        # Exclude project owner
        if user.id == project.owner_id:
            continue

        user_skill_ids = {
            skill.skill_id
            for skill in user.skills
        }

        common_skills = len(
            project_skill_ids & user_skill_ids
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
            "user_id": user.id,
            "name": user.name,
            "skill_match": skill_match,
            "activity_score": activity_score,
            "reliability_score": reliability_score,
            "overall_score": overall_score,
        })

    rankings.sort(
        key=lambda x: x["overall_score"],
        reverse=True
    )

    try:
        redis_client.setex(
            cache_key,
            3600,
            json.dumps(rankings)
        )
    except Exception as e:
        print("Redis Write Error:", e)

    return rankings