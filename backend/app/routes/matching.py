from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.project import Project
from app.models.user import User

import json

from app.utils.redis_client import redis_client


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

    # Redis cache key
    cache_key = f"project_matches:{project_id}"

    # Check Redis cache first
    cached_data = redis_client.get(cache_key)

    if cached_data:
        return json.loads(cached_data)

    # Get project
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

    # Get required project skills
    project_skill_ids = {

        skill.id

        for skill in project.skills

    }

    # Get all users
    users = db.query(
        User
    ).all()

    matches = []

    # Calculate match scores
    for user in users:

        # Get user skills
        user_skill_ids = {

            skill.id

            for skill in user.skills

        }

        # Find common skills
        common_skills = len(

            project_skill_ids
            &
            user_skill_ids

        )

        total_project_skills = len(
            project_skill_ids
        )

        # Calculate score
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

    # Sort highest matches first
    matches.sort(

        key=lambda x:
        x["match_score"],

        reverse=True

    )

    # Store result in Redis for 1 hour
    redis_client.setex(
        cache_key,
        3600,
        json.dumps(matches)
    )

    return matches