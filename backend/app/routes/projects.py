from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query

from sqlalchemy.orm import Session

from app.database import get_db


from app.models.project import Project

from app.utils.security import (
    get_current_user
)

from app.schemas.project import (
    ProjectCreate,
    ProjectResponse
)

router = APIRouter()


@router.post(
    "/projects",
    response_model=ProjectResponse
)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    new_project = Project(
        title=project.title,
        description=project.description,
        timeline=project.timeline,
        project_type=project.project_type,
        owner_id=current_user.id
    )

    db.add(new_project)

    db.commit()

    db.refresh(new_project)

    return new_project


@router.get("/projects")
def get_projects(
    limit: int = Query(10, le=100),
    offset: int = 0,
    db: Session = Depends(get_db)
):

    projects = (
        db.query(Project)
        .offset(offset)
        .limit(limit)
        .all()
    )

    return projects

@router.get(
    "/projects/me",
    response_model=list[ProjectResponse]
)
def get_my_projects(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    projects = (
        db.query(Project)
        .filter(Project.owner_id == current_user.id)
        .all()
    )

    return projects



@router.get(
    "/projects/{project_id}",
    response_model=ProjectResponse
)
def get_project(
    project_id: int,
    db: Session = Depends(get_db)
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

    return project


@router.put(
    "/projects/{project_id}",
    response_model=ProjectResponse
)
def update_project(
    project_id: int,
    updated: ProjectCreate,
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

    project.title = updated.title
    project.description = updated.description
    project.timeline = updated.timeline
    project.project_type = updated.project_type

    db.commit()

    db.refresh(project)

    return project


@router.delete(
    "/projects/{project_id}"
)
def delete_project(
    project_id: int,
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

    db.delete(project)

    db.commit()

    return {
        "message": "Project deleted"
    }