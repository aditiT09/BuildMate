from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from app.models.project import Project
from app.models.user import User
from app.models.skill import Skill
from app.models.opportunity import Opportunity
from app.models.user_skill import UserSkill

from app.utils.redis_client import redis_client

import json

MIN_MATCH_SCORE = 40


def get_project_matches(
    project_id: int,
    db: Session
):

    cache_key = f"buildmate:project_matches:{project_id}"

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
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    project_skill_ids = {
        skill.skill_id
        for skill in project.skills
    }

    if not project_skill_ids:
        matches = []
    else:
        skill_map = {
            skill.id: skill.name
            for skill in db.query(Skill).all()
        }

        users = (
            db.query(User)
            .options(joinedload(User.skills))
            .filter(User.skills.any(UserSkill.skill_id.in_(project_skill_ids)))
            .all()
        )

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
            total_project_skills = len(project_skill_ids)

            skill_match = round(
                (common_skills / total_project_skills) * 100,
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
                "user_id": user.id,
                "name": user.name,
                "overall_score": overall_score,
                "skill_match": skill_match,
                "activity_score": activity_score,
                "reliability_score": reliability_score,
                "matching_skills": matching_skills,
                "missing_skills": missing_skills
            })

        matches.sort(
            key=lambda x: x["overall_score"],
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


def get_opportunity_matches(
    opportunity_id: int,
    db: Session
):
    cache_key = f"buildmate:opportunity_matches:{opportunity_id}"

    try:
        cached_data = redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)
    except Exception as e:
        print("Redis Read Error (falling back to database):", e)

    opportunity = (
        db.query(Opportunity)
        .options(
            joinedload(Opportunity.skills),
            joinedload(Opportunity.project).joinedload(Project.skills)
        )
        .filter(Opportunity.id == opportunity_id)
        .first()
    )

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    opportunity_skill_ids = {
        skill.skill_id
        for skill in opportunity.skills
    }

    if not opportunity_skill_ids:
        opportunity_skill_ids = {
            skill.skill_id
            for skill in opportunity.project.skills
        }

    skill_map = {
        skill.id: skill.name
        for skill in db.query(Skill).all()
    }

    if opportunity_skill_ids:
        users = (
            db.query(User)
            .options(joinedload(User.skills))
            .filter(User.skills.any(UserSkill.skill_id.in_(opportunity_skill_ids)))
            .all()
        )
    else:
        users = (
            db.query(User)
            .options(joinedload(User.skills))
            .all()
        )

    matches = []

    for user in users:
        if user.id == opportunity.project.owner_id:
            continue

        user_skill_ids = {
            skill.skill_id
            for skill in user.skills
        }

        common_ids = (
            opportunity_skill_ids &
            user_skill_ids
        )

        missing_ids = (
            opportunity_skill_ids -
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
        total_opportunity_skills = len(opportunity_skill_ids)

        if total_opportunity_skills == 0:
            skill_match = 0
        else:
            skill_match = round(
                (common_skills / total_opportunity_skills) * 100,
                2
            )

        if total_opportunity_skills > 0 and skill_match < 40.0:
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
            "user_id": user.id,
            "name": user.name,
            "bio": user.bio,
            "overall_score": overall_score,
            "skill_match": skill_match,
            "activity_score": activity_score,
            "reliability_score": reliability_score,
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
            "user_skills": [skill_map[sid] for sid in user_skill_ids if sid in skill_map]
        })

    matches.sort(
        key=lambda x: x["overall_score"],
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