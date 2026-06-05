from fastapi import APIRouter, HTTPException
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user_skill import UserSkill
from app.schemas.user_skill import UserSkillCreate

from app.utils.security import get_current_user
from app.utils.redis_client import redis_client
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

    db.commit()
    try:
     redis_client.flushall()
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