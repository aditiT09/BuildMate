from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.opportunity import Opportunity
from app.models.user import User
from app.utils.security import get_current_user

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
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    opportunity = (
        db.query(Opportunity)
        .filter(Opportunity.id == opportunity_id)
        .first()
    )

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found",
        )

    if opportunity.project.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the project owner can view applicant rankings",
        )

    rankings = rank_applicants(
        opportunity_id,
        db
    )
    return rankings[offset : offset + limit]
