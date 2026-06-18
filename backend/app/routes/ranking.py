from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.project import Project
from app.models.user import User
from app.utils.security import get_current_user

from app.services.ranking_service import (
    get_best_candidates
)

router = APIRouter(
    prefix="/ranking",
    tags=["Ranking"]
)


@router.get(
    "/projects/{project_id}"
)
def rank_candidates(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the project owner can view candidate rankings",
        )

    return get_best_candidates(
        project_id,
        db
    )
