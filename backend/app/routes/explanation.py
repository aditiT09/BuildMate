from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.services.explanation_service import (
    get_match_explanation
)

router = APIRouter(
    prefix="/explanation",
    tags=["Explanation"]
)


@router.get(
    "/projects/{project_id}/users/{user_id}"
)
def explain_match(
    project_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):

    return get_match_explanation(
        project_id,
        user_id,
        db
    )