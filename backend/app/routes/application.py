from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.application import Application

from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse
)
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
    db: Session = Depends(get_db)
):

    new_application = Application(
        user_id=application.user_id,
        opportunity_id=application.opportunity_id,
        status=application.status
    )

    db.add(new_application)

    db.commit()

    db.refresh(new_application)

    return new_application
@router.get(
    "/",
    response_model=list[ApplicationResponse]
)
def get_applications(
    db: Session = Depends(get_db)
):

    applications = (
        db.query(Application)
        .all()
    )

    return applications

@router.put(
    "/{application_id}",
    response_model=ApplicationResponse
)
def update_application(
    application_id: int,
    updated: ApplicationCreate,
    db: Session = Depends(get_db)
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

    application.user_id = updated.user_id
    application.opportunity_id = updated.opportunity_id
    application.status = updated.status

    db.commit()

    db.refresh(application)

    return application
@router.delete(
    "/{application_id}"
)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db)
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

    db.delete(application)

    db.commit()

    return {
        "message":
        "Application deleted"
    }