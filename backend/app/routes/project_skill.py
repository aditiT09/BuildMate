from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.project import Project
from app.models.project_skill import ProjectSkill

from app.schemas.project_skill import ProjectSkillCreate

from app.utils.security import get_current_user
from app.utils.redis_client import redis_client


router = APIRouter(
    prefix="/project-skills",
    tags=["Project Skills"]
)


@router.post("/")
def add_project_skill(
    data: ProjectSkillCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    project = (
        db.query(Project)
        .filter(Project.id == data.project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    existing = (
        db.query(ProjectSkill)
        .filter(
            ProjectSkill.project_id == data.project_id,
            ProjectSkill.skill_id == data.skill_id
        )
        .first()
    )

    if existing:
        return {
            "message": "Already added"
        }

    project_skill = ProjectSkill(
        project_id=data.project_id,
        skill_id=data.skill_id
    )

    db.add(project_skill)

    db.commit()

    try:
     redis_client.flushall()
    except Exception:
     pass

    db.refresh(project_skill)

    return project_skill


@router.get("/")
def get_project_skills(
    db: Session = Depends(get_db)
):

    return (
        db.query(ProjectSkill)
        .all()
    )
@router.get("/{project_id}")
def get_project_skills_by_project(
    project_id: int,
    db: Session = Depends(get_db)
):

    skills = (
        db.query(ProjectSkill)
        .filter(
            ProjectSkill.project_id == project_id
        )
        .all()
    )

    return [
        {
            "id": item.skill.id,
            "name": item.skill.name
        }
        for item in skills
    ]