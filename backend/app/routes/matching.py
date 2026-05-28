from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.services.matching_service import get_project_matches


router = APIRouter(
    prefix="/matching",
    tags=["Matching"]
)


@router.get(
    "/projects/{project_id}/matches"
)
def get_matches(
    project_id: int,
    db: Session = Depends(get_db)
):

    return get_project_matches(
        project_id,
        db
    )