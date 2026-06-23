from fastapi import APIRouter, HTTPException
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db

from app.models.user_skill import UserSkill
from app.schemas.user_skill import UserSkillCreate

from app.utils.security import get_current_user
from app.utils.redis_client import invalidate_all_matching_caches
from app.models.skill import Skill


router = APIRouter(
    prefix="/user-skills",
    tags=["User Skills"]
)


@router.post("/")
def add_skill(

    skill: UserSkillCreate,

    db: Session = Depends(get_db),

    current_user=Depends(
        get_current_user
    )

):
    # Validate skill exists
    target_skill = db.query(Skill).filter(Skill.id == skill.skill_id).first()
    if not target_skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    existing = (
        db.query(UserSkill)
        .filter(
            UserSkill.user_id == current_user.id,
            UserSkill.skill_id == skill.skill_id
        )
        .first()
    )

    if existing:

     raise HTTPException(

        status_code=400,

        detail="Skill already added"

    )

    new_skill = UserSkill(

        user_id=current_user.id,

        skill_id=skill.skill_id

    )

    db.add(
        new_skill
    )

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Skill already added"
        )

    try:
        invalidate_all_matching_caches()
    except Exception:
        pass

    db.refresh(
        new_skill
    )

    return new_skill


@router.get("/")
def get_my_skills(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    skills = (
        db.query(
            Skill.id,
            Skill.name
        )
        .join(
            UserSkill,
            UserSkill.skill_id == Skill.id
        )
        .filter(
            UserSkill.user_id == current_user.id
        )
        .all()
    )

    return [
        {
            "id": skill.id,
            "name": skill.name
        }
        for skill in skills
    ]
@router.delete("/{skill_id}")
def remove_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user_skill = (
        db.query(UserSkill)
        .filter(
            UserSkill.user_id == current_user.id,
            UserSkill.skill_id == skill_id
        )
        .first()
    )

    if not user_skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    db.delete(user_skill)
    db.commit()

    try:
        invalidate_all_matching_caches()
    except Exception:
        pass

    return {
        "message": "Skill removed"
    }