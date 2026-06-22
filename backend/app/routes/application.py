from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db

from app.models.application import Application
from app.models.opportunity import Opportunity
from app.models.project import Project
from app.models.user import User

from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse
)

from app.utils.security import get_current_user


router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


@router.post(
    "/",
    response_model=ApplicationResponse
)
def create_application(
    application: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    opportunity = (
        db.query(Opportunity)
        .filter(
            Opportunity.id == application.opportunity_id
        )
        .first()
    )

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )
    if opportunity.status == "closed":
        raise HTTPException(
            status_code=400,
            detail="Opportunity is closed"
    )


    existing_application = (
        db.query(Application)
        .filter(
            Application.user_id == current_user.id,
            Application.opportunity_id == application.opportunity_id
        )
        .first()
    )

    if existing_application:
        raise HTTPException(
            status_code=400,
            detail="Already applied"
        )

    new_application = Application(
        user_id=current_user.id,
        opportunity_id=application.opportunity_id,
        status="pending"
    )

    db.add(new_application)
    current_user.activity_score = min(100, (current_user.activity_score or 50) + 2)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Already applied"
        )

    db.refresh(new_application)

    return new_application

@router.get(
    "/me",
    response_model=list[ApplicationResponse]
)
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    applications = (
        db.query(Application)
        .filter(
            Application.user_id == current_user.id
        )
        .all()
    )

    return applications


@router.get(
    "/opportunity/{opportunity_id}",
    response_model=list[ApplicationResponse]
)
def get_opportunity_applications(
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

    applications = (
        db.query(Application)
        .filter(
            Application.opportunity_id == opportunity_id
        )
        .all()
    )

    return applications


@router.put(
    "/{application_id}/accept",
    response_model=ApplicationResponse
)
def accept_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    application = (
        db.query(Application)
        .filter(
            Application.id == application_id
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    # 1. Lock the Opportunity row first
    opportunity = (
        db.query(Opportunity)
        .filter(
            Opportunity.id == application.opportunity_id
        )
        .with_for_update()
        .first()
    )

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    # 2. Reload/lock the Application within the opportunity lock
    application = (
        db.query(Application)
        .filter(
            Application.id == application_id
        )
        .with_for_update()
        .first()
    )

    if application.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Application already processed"
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

    accepted_count = (
        db.query(Application)
        .filter(
            Application.opportunity_id == opportunity.id,
            Application.status == "accepted"
        )
        .count()
    )

    if accepted_count >= opportunity.seats:
        raise HTTPException(
            status_code=400,
            detail="No seats remaining"
        )

    application.status = "accepted"

    application.user.reliability_score = min(100, (
        application.user.reliability_score or 0
    ) + 5)

    if accepted_count + 1 >= opportunity.seats:
        opportunity.status = "closed"

    db.commit()
    db.refresh(application)

    return application
@router.put(
    "/{application_id}/reject",
    response_model=ApplicationResponse
)
def reject_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    application = (
        db.query(Application)
        .filter(
            Application.id == application_id
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    if application.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Application already processed"
        )

    opportunity = (
        db.query(Opportunity)
        .filter(
            Opportunity.id == application.opportunity_id
        )
        .first()
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

    current_score = (
        application.user.reliability_score or 0
)

    application.user.reliability_score = max(
        0,
        current_score - 1
)
    application.status = "rejected"
    db.commit()

    db.refresh(application)

    return application
   