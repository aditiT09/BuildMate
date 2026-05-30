from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.user import User
from app.models.skill import Skill


def get_match_explanation(
    project_id: int,
    user_id: int,
    db: Session
):

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

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    project_skill_ids = {

        skill.skill_id

        for skill in project.skills

    }

    user_skill_ids = {

        skill.skill_id

        for skill in user.skills

    }

    matched_skill_ids = (
        project_skill_ids &
        user_skill_ids
    )

    missing_skill_ids = (
        project_skill_ids -
        user_skill_ids
    )

    matched_skills = []

    for skill_id in matched_skill_ids:

        skill = (
            db.query(Skill)
            .filter(Skill.id == skill_id)
            .first()
        )

        if skill:

            matched_skills.append(
                skill.name
            )

    missing_skills = []

    for skill_id in missing_skill_ids:

        skill = (
            db.query(Skill)
            .filter(Skill.id == skill_id)
            .first()
        )

        if skill:

            missing_skills.append(
                skill.name
            )

    if len(project_skill_ids) == 0:

        match_score = 0

    else:

        match_score = round(

            (
                len(matched_skill_ids)
                /
                len(project_skill_ids)
            )
            * 100,

            2

        )

    return {

        "user_id": user.id,

        "name": user.name,

        "match_score": match_score,

        "matched_skills": matched_skills,

        "missing_skills": missing_skills

    }