from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.project import Project
from app.models.project_skill import ProjectSkill
from app.models.skill import Skill

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

    # Validate skill exists
    skill = db.query(Skill).filter(Skill.id == data.skill_id).first()
    if not skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

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

@router.delete("/{project_id}/skills/{skill_id}")
def remove_project_skill(
    project_id: int,
    skill_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
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

    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    project_skill = (
        db.query(ProjectSkill)
        .filter(
            ProjectSkill.project_id == project_id,
            ProjectSkill.skill_id == skill_id
        )
        .first()
    )

    if not project_skill:
        raise HTTPException(
            status_code=404,
            detail="Project skill association not found"
        )

    db.delete(project_skill)
    db.commit()

    try:
        redis_client.flushall()
    except Exception:
        pass

    return {"message": "Project skill removed"}