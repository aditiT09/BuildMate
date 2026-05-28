from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.opportunity import Opportunity
from app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityResponse
)
from fastapi import Query

router = APIRouter(
    prefix="/opportunities",
    tags=["Opportunities"]
)


# STEP 3 POST API GOES HERE
@router.post(
    "/",
    response_model=OpportunityResponse
)
def create_opportunity(
    opportunity: OpportunityCreate,
    db: Session = Depends(get_db)
):

    new_opportunity = Opportunity(
        role=opportunity.role,
        project_id=opportunity.project_id,
        seats=opportunity.seats,
        status=opportunity.status
    )

    db.add(new_opportunity)

    db.commit()

    db.refresh(new_opportunity)

    return new_opportunity
@router.get("/opportunities")
def get_opportunities(

    limit: int = Query(10, le=100),
    offset: int = 0,

    db: Session = Depends(get_db)

):

    opportunities = db.query(Opportunity)\
        .offset(offset)\
        .limit(limit)\
        .all()

    return opportunities
@router.put(
    "/{opportunity_id}",
    response_model=OpportunityResponse
)
def update_opportunity(
    opportunity_id: int,
    updated: OpportunityCreate,
    db: Session = Depends(get_db)
):

    opportunity = (
        db.query(Opportunity)
        .filter(
            Opportunity.id == opportunity_id
        )
        .first()
    )

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    opportunity.role = updated.role
    opportunity.project_id = updated.project_id
    opportunity.seats = updated.seats
    opportunity.status = updated.status

    db.commit()

    db.refresh(opportunity)

    return opportunity
@router.delete(
    "/{opportunity_id}"
)
def delete_opportunity(
    opportunity_id: int,
    db: Session = Depends(get_db)
):

    opportunity = (
        db.query(Opportunity)
        .filter(
            Opportunity.id == opportunity_id
        )
        .first()
    )

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    db.delete(opportunity)

    db.commit()

    return {
        "message":
        "Opportunity deleted"
    }