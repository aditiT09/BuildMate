from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.project import Project
from app.models.project_resource import ProjectResource
from app.models.user import User

from app.schemas.project_resource import (
    ProjectResourceCreate,
    ProjectResourceResponse,
)

from app.utils.security import get_current_user


router = APIRouter(
    prefix="/projects",
    tags=["Project Links"]
)


@router.post(
    "/{project_id}/links",
    response_model=ProjectResourceResponse
)
def create_project_link(
    project_id: int,
    resource: ProjectResourceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
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

    new_resource = ProjectResource(
        project_id=project_id,
        title=resource.title,
        resource_type=resource.resource_type.value,
        url=str(resource.url),
    )

    db.add(new_resource)

    db.commit()

    db.refresh(new_resource)

    return new_resource


@router.get(
    "/{project_id}/links",
    response_model=list[ProjectResourceResponse]
)
def get_project_links(
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

    return (
        db.query(ProjectResource)
        .filter(
            ProjectResource.project_id == project_id
        )
        .all()
    )


@router.delete(
    "/{project_id}/links/{link_id}"
)
def delete_project_link(
    project_id: int,
    link_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    resource = (
        db.query(ProjectResource)
        .filter(
            ProjectResource.id == link_id,
            ProjectResource.project_id == project_id
        )
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Link not found"
        )

    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    db.delete(resource)

    db.commit()

    return {
        "message": "Link deleted"
    }