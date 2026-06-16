from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.services.matching_service import get_project_matches
from app.models.project import Project
from app.utils.security import get_current_user
from app.models.user import User
from fastapi import HTTPException




router = APIRouter(
    prefix="/matching",
    tags=["Matching"]
)



@router.get(
    "/projects/{project_id}/matches"
)
def get_matches(
    project_id: int,
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
            detail="Only the project owner can view matches"
        )

    return get_project_matches(
        project_id,
        db
    )