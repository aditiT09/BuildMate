
from fastapi import APIRouter, Depends, Query, HTTPException

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.user import User

from app.utils.security import (
    hash_password,
    get_current_user,
)
from app.utils.scoring import recalculate_user_scores

from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserUpdate,
)

router = APIRouter()


@router.post(
    "/users",
    response_model=UserResponse,
    status_code=201,
)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    try:
        # UserCreate schema already validates and normalizes
        new_user = User(
            name=user.name,
            email=user.email,
            bio=user.bio,
            password=hash_password(user.password),
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=409,
            detail="Email already registered",
        )

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Internal server error",
        )


@router.get(
    "/users",
    response_model=list[UserResponse],
)
def get_users(
    limit: int = Query(10, le=100),
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    users = (
        db.query(User)
        .offset(offset)
        .limit(limit)
        .all()
    )

    return users


@router.put(
    "/users/me",
    response_model=UserResponse,
)
def update_me(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # UserUpdate schema already validates and normalizes
    current_user.name = payload.name
    current_user.bio = payload.bio

    db.commit()
    db.refresh(current_user)

    return current_user


@router.get(
    "/users/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recalculate_user_scores(current_user, db)
    return current_user
