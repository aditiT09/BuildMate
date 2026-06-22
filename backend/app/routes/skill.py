from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db

from app.models.skill import Skill
from app.models.user import User
from app.utils.security import get_current_user
from fastapi import Query

router = APIRouter(
    prefix="/skills",
    tags=["Skills"]
)


@router.post("/")
def create_skill(

    name: str,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    existing = db.query(
        Skill
    ).filter(
        Skill.name == name
    ).first()

    if existing:

        return {
            "message":
            "Skill already exists"
        }

    skill = Skill(
        name=name
    )

    db.add(skill)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Skill already exists"
        )

    db.refresh(skill)

    return skill


@router.get("/skills")
def get_skills(

    limit: int = Query(100, le=1000),
    offset: int = 0,

    db: Session = Depends(get_db)

):

    skills = db.query(Skill)\
        .offset(offset)\
        .limit(limit)\
        .all()

    return skills
