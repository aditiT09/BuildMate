from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.skill import Skill

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


@router.get("/")
def get_skills(

    db: Session = Depends(get_db)

):

    return db.query(
        Skill
    ).all()