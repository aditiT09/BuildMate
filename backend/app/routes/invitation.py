from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db

from app.models.invitation import Invitation
from app.models.opportunity import Opportunity
from app.models.project import Project
from app.models.user import User
from app.models.application import Application

from app.schemas.invitation import (
    InvitationCreate,
    InvitationResponse,
    InvitationRespond
)

from app.utils.security import get_current_user


router = APIRouter(
    prefix="/invitations",
    tags=["Invitations"]
)


@router.post("/", response_model=InvitationResponse)
def create_invitation(
    data: InvitationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    opportunity = (
        db.query(Opportunity)
        .filter(Opportunity.id == data.opportunity_id)
        .first()
    )

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    if opportunity.project.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to invite users to this project"
        )

    invited_user = (
        db.query(User)
        .filter(User.id == data.user_id)
        .first()
    )

    if not invited_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Check if already invited or applied
    existing = (
        db.query(Invitation)
        .filter(
            Invitation.opportunity_id == data.opportunity_id,
            Invitation.user_id == data.user_id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already invited"
        )

    existing_app = (
        db.query(Application)
        .filter(
            Application.opportunity_id == data.opportunity_id,
            Application.user_id == data.user_id
        )
        .first()
    )

    if existing_app:
        raise HTTPException(
            status_code=400,
            detail="User already applied to this role"
        )

    invitation = Invitation(
        opportunity_id=data.opportunity_id,
        user_id=data.user_id,
        status="pending"
    )

    db.add(invitation)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="User already invited"
        )
    db.refresh(invitation)

    return invitation


@router.get("/sent", response_model=list[InvitationResponse])
def get_sent_invitations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invitations = (
        db.query(Invitation)
        .join(Opportunity)
        .join(Project)
        .filter(Project.owner_id == current_user.id)
        .all()
    )
    return invitations


@router.get("/received", response_model=list[InvitationResponse])
def get_received_invitations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invitations = (
        db.query(Invitation)
        .filter(Invitation.user_id == current_user.id)
        .all()
    )
    return invitations


@router.put("/{invitation_id}/respond", response_model=InvitationResponse)
def respond_to_invitation(
    invitation_id: int,
    data: InvitationRespond,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invitation = (
        db.query(Invitation)
        .filter(Invitation.id == invitation_id)
        .first()
    )

    if not invitation:
        raise HTTPException(
            status_code=404,
            detail="Invitation not found"
        )

    if invitation.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to respond to this invitation"
        )

    # 1. Lock the Opportunity row first
    opportunity = (
        db.query(Opportunity)
        .filter(Opportunity.id == invitation.opportunity_id)
        .with_for_update()
        .first()
    )
    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    # 2. Reload/lock the Invitation within the opportunity lock
    invitation = (
        db.query(Invitation)
        .filter(Invitation.id == invitation_id)
        .with_for_update()
        .first()
    )

    if invitation.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Invitation already processed"
        )

    status_lower = data.status.lower()
    if status_lower not in ["accepted", "rejected"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid response status"
        )

    if status_lower == "accepted":
        # Check seats remaining
        accepted_count = (
            db.query(Application)
            .filter(
                Application.opportunity_id == opportunity.id,
                Application.status == "accepted"
            )
            .count()
        )

        if accepted_count >= opportunity.seats:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail="No seats remaining for this role"
            )

        # Create approved application automatically
        application = Application(
            user_id=current_user.id,
            opportunity_id=opportunity.id,
            status="accepted"
        )
        db.add(application)

        # Update reliability score
        current_user.reliability_score = min(100, (current_user.reliability_score or 0) + 5)

        # Close opportunity if filled
        if accepted_count + 1 >= opportunity.seats:
            opportunity.status = "closed"

    invitation.status = status_lower
    db.commit()
    db.refresh(invitation)

    return invitation


@router.delete("/opportunity/{opportunity_id}/user/{user_id}")
def cancel_invitation(
    opportunity_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    opportunity = (
        db.query(Opportunity)
        .filter(Opportunity.id == opportunity_id)
        .first()
    )

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    if opportunity.project.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to cancel invitations for this project"
        )

    invitation = (
        db.query(Invitation)
        .filter(
            Invitation.opportunity_id == opportunity_id,
            Invitation.user_id == user_id
        )
        .first()
    )

    if not invitation:
        raise HTTPException(
            status_code=404,
            detail="Invitation not found"
        )

    if invitation.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Cannot cancel an invitation that is not pending"
        )

    db.delete(invitation)
    db.commit()

    return {"detail": "Invitation cancelled successfully"}

