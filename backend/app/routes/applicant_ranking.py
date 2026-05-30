from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.services.applicant_ranking_service import (
    rank_applicants
)

router = APIRouter(
    prefix="/applicant-ranking",
    tags=["Applicant Ranking"]
)


@router.get(
    "/opportunity/{opportunity_id}"
)
def get_ranked_applicants(
    opportunity_id: int,
    db: Session = Depends(get_db)
):

    return rank_applicants(
        opportunity_id,
        db
    )