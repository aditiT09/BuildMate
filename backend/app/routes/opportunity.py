from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.opportunity import Opportunity
from app.models.project import Project
from app.models.user import User

from app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityResponse
)

from app.utils.security import get_current_user


router = APIRouter(
    prefix="/opportunities",
    tags=["Opportunities"]
)


@router.post(
    "/",
    response_model=OpportunityResponse
)
def create_opportunity(
    opportunity: OpportunityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    project = (
        db.query(Project)
        .filter(
            Project.id == opportunity.project_id
        )
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


@router.get(
    "/",
    response_model=list[OpportunityResponse]
)
def get_opportunities(
    limit: int = Query(10, le=100),
    offset: int = 0,
    db: Session = Depends(get_db)
):

    opportunities = (
        db.query(Opportunity)
        .offset(offset)
        .limit(limit)
        .all()
    )

    return opportunities


@router.get(
    "/{opportunity_id}",
    response_model=OpportunityResponse
)
def get_opportunity(
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

    return opportunity


@router.put(
    "/{opportunity_id}",
    response_model=OpportunityResponse
)
def update_opportunity(
    opportunity_id: int,
    updated: OpportunityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
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

    project = (
        db.query(Project)
        .filter(
            Project.id == opportunity.project_id
        )
        .first()
    )

    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
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

    project = (
        db.query(Project)
        .filter(
            Project.id == opportunity.project_id
        )
        .first()
    )

    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    db.delete(opportunity)

    db.commit()

    return {
        "message": "Opportunity deleted"
    }