from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.skill import Skill
from fastapi import Query

router = APIRouter(
    prefix="/skills",
    tags=["Skills"]
)


@router.post("/")
def create_skill(

    name: str,

    db: Session = Depends(get_db)

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

    db.commit()

    db.refresh(skill)

    return skill


@router.get("/skills")
def get_skills(

    limit: int = Query(10, le=100),
    offset: int = 0,

    db: Session = Depends(get_db)

):

    skills = db.query(Skill)\
        .offset(offset)\
        .limit(limit)\
        .all()

    return skills