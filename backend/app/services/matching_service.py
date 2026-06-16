from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.user import User
from app.models.skill import Skill

from app.utils.redis_client import redis_client

import json

MIN_MATCH_SCORE = 40


def get_project_matches(
    project_id: int,
    db: Session
):

    cache_key = f"project_matches:{project_id}"

    try:
        cached_data = redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)
    except Exception as e:
        print("Redis Read Error (falling back to database):", e)

    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    skill_map = {
        skill.id: skill.name
        for skill in db.query(Skill).all()
    }

    project_skill_ids = {
        skill.skill_id
        for skill in project.skills
    }

    users = db.query(User).all()

    matches = []

    for user in users:

        # Don't recommend the project owner
        if user.id == project.owner_id:
            continue

        user_skill_ids = {
            skill.skill_id
            for skill in user.skills
        }

        common_ids = (
            project_skill_ids &
            user_skill_ids
        )

        missing_ids = (
            project_skill_ids -
            user_skill_ids
        )

        matching_skills = [
            skill_map[sid]
            for sid in common_ids
            if sid in skill_map
        ]

        missing_skills = [
            skill_map[sid]
            for sid in missing_ids
            if sid in skill_map
        ]

        common_skills = len(common_ids)

        total_project_skills = len(
            project_skill_ids
        )

        if total_project_skills == 0:
            skill_match = 0

        else:
            skill_match = round(
                (
                    common_skills /
                    total_project_skills
                ) * 100,
                2
            )

        # Filter on skill_match only
        if skill_match < MIN_MATCH_SCORE:
            continue

        activity_score = user.activity_score or 0

        reliability_score = user.reliability_score or 0

        overall_score = round(
            (
                skill_match * 0.7
                + activity_score * 0.2
                + reliability_score * 0.1
            ),
            2
        )

        matches.append({

            "user_id":
                user.id,

            "name":
                user.name,

            "overall_score":
                overall_score,

            "skill_match":
                skill_match,

            "activity_score":
                activity_score,

            "reliability_score":
                reliability_score,

            "matching_skills":
                matching_skills,

            "missing_skills":
                missing_skills

        })

    matches.sort(
        key=lambda x:
        x["overall_score"],
        reverse=True
    )

    try:
        redis_client.setex(
            cache_key,
            3600,
            json.dumps(matches)
        )
    except Exception as e:
        print("Redis Write Error:", e)

    return matches