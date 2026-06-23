from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.models.project import Project
from app.models.user import User
from app.models.skill import Skill
from app.models.user_skill import UserSkill

def get_skill_gap(
    project_id: int,
    user_id: int,
    db: Session
):
    # Retrieve project
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

    # Retrieve user
    user = (
        db.query(User)
        .options(joinedload(User.skills))
        .filter(User.id == user_id)
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Project and User skill IDs
    project_skill_ids = {
        ps.skill_id
        for ps in project.skills
    }
    user_skill_ids = {
        us.skill_id
        for us in user.skills
    }

    # Map only required skills in db for quick lookup
    if project_skill_ids:
        skills = db.query(Skill).filter(Skill.id.in_(project_skill_ids)).all()
        skill_map = {skill.id: skill.name for skill in skills}
    else:
        skill_map = {}


    # Intersections
    matched_ids = project_skill_ids & user_skill_ids
    missing_ids = project_skill_ids - user_skill_ids

    matched_skills = [skill_map[sid] for sid in matched_ids if sid in skill_map]
    missing_skills = [skill_map[sid] for sid in missing_ids if sid in skill_map]

    total_req_skills = len(project_skill_ids)
    match_percentage = 0.0
    if total_req_skills > 0:
        match_percentage = round((len(matched_ids) / total_req_skills) * 100, 2)

    # Prioritize missing skills by how popular they are on the platform
    # (i.e. trending skills have higher learning priority)
    prioritized_recommendations = []
    if missing_ids:
        popularity_ranks = (
            db.query(
                UserSkill.skill_id,
                func.count(UserSkill.id).label("count")
            )
            .filter(UserSkill.skill_id.in_(missing_ids))
            .group_by(UserSkill.skill_id)
            .order_by(func.count(UserSkill.id).desc())
            .all()
        )
        
        popularity_map = {item.skill_id: item.count for item in popularity_ranks}
        
        # Sort missing skills by popularity (high count first)
        sorted_missing_ids = sorted(
            missing_ids,
            key=lambda sid: popularity_map.get(sid, 0),
            reverse=True
        )

        for sid in sorted_missing_ids:
            if sid in skill_map:
                skill_name = skill_map[sid]
                count = popularity_map.get(sid, 0)
                prioritized_recommendations.append({
                    "skill_name": skill_name,
                    "reason": f"Required for {project.title}. This skill is held by {count} other builders on BuildMate.",
                    "priority": "High" if count > 2 else "Medium"
                })

    return {
        "project_id": project.id,
        "project_title": project.title,
        "user_id": user.id,
        "user_name": user.name,
        "match_percentage": match_percentage,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "recommendations": prioritized_recommendations
    }
