from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

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
    db: Session = Depends(get_db)
):

    return get_best_candidates(
        project_id,
        db
    )