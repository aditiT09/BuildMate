from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.profile import Profile
from app.models.user import User

from app.schemas.profile import (
    ProfileCreate,
    ProfileOut,
)

from app.utils.security import get_current_user
from app.utils.scoring import recalculate_user_scores

router = APIRouter()


# Logged-in user's profile
@router.get("/me", response_model=ProfileOut)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = (
        db.query(Profile)
        .filter(Profile.user_id == current_user.id)
        .first()
    )

    if not profile:
        profile = Profile(
            user_id=current_user.id
        )

        db.add(profile)
        db.commit()
        db.refresh(profile)
    else:
        recalculate_user_scores(current_user, db)

    return profile


# Get author profile (Aditi Tiwari)
@router.get("/author/profile")
def get_author_profile(
    db: Session = Depends(get_db),
):
    profile = (
        db.query(Profile)
        .join(User, Profile.user_id == User.id)
        .filter(User.email == "adititiwari09@gmail.com")
        .first()
    )
    if not profile:
        return {
            "id": 0,
            "user_id": 0,
            "full_name": "Aditi Tiwari",
            "avatar": None
        }
    return profile


# Public profile
@router.get("/{user_id}", response_model=ProfileOut)
def get_profile(
    user_id: int,
    db: Session = Depends(get_db),
):
    profile = (
        db.query(Profile)
        .filter(Profile.user_id == user_id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    if profile.user:
        recalculate_user_scores(profile.user, db)

    return profile


# Create / Update profile
@router.put("/me", response_model=ProfileOut)
def save_profile(
    profile_data: ProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = (
        db.query(Profile)
        .filter(Profile.user_id == current_user.id)
        .first()
    )

    if profile:
        profile.full_name = profile_data.full_name
        profile.bio = profile_data.bio
        profile.college = profile_data.college
        profile.degree = profile_data.degree
        profile.skills = profile_data.skills
        profile.github = profile_data.github
        profile.linkedin = profile_data.linkedin
        profile.portfolio = profile_data.portfolio
        profile.avatar = profile_data.avatar
        profile.availability = profile_data.availability

    else:
        profile = Profile(
            user_id=current_user.id,
            full_name=profile_data.full_name,
            bio=profile_data.bio,
            college=profile_data.college,
            degree=profile_data.degree,
            skills=profile_data.skills,
            github=profile_data.github,
            linkedin=profile_data.linkedin,
            portfolio=profile_data.portfolio,
            avatar=profile_data.avatar,
            availability=profile_data.availability,
        )

        db.add(profile)

    db.commit()
    db.refresh(profile)

    return profile