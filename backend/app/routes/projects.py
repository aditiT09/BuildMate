from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.project import Project

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
    db: Session = Depends(get_db)
):

    new_project = Project(

        title=project.title,

        description=project.description,

        timeline=project.timeline,

        project_type=project.project_type,

        owner_id=project.owner_id

    )

    db.add(new_project)

    db.commit()

    db.refresh(new_project)

    return new_project


@router.get(
    "/projects",
    response_model=list[ProjectResponse]
)
def get_projects(
    db: Session = Depends(get_db)
):

    return db.query(Project).all()


@router.put(
    "/projects/{project_id}",
    response_model=ProjectResponse
)
def update_project(
    project_id: int,
    project: ProjectCreate,
    db: Session = Depends(get_db)
):

    existing_project = (

        db.query(Project)

        .filter(
            Project.id == project_id
        )

        .first()
    )

    if not existing_project:

        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    existing_project.title = project.title

    existing_project.description = (
        project.description
    )

    existing_project.timeline = (
        project.timeline
    )

    existing_project.project_type = (
        project.project_type
    )

    existing_project.owner_id = (
        project.owner_id
    )

    db.commit()

    db.refresh(
        existing_project
    )

    return existing_project


@router.delete(
    "/projects/{project_id}"
)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db)
):

    project = (

        db.query(Project)

        .filter(
            Project.id == project_id
        )

        .first()
    )

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    db.delete(project)

    db.commit()

    return {

        "message":
        "Project deleted"

    }