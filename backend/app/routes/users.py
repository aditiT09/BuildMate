from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query
from fastapi import HTTPException

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.utils.security import hash_password
from app.utils.security import get_current_user


router = APIRouter()


@router.post(
    "/users",
    response_model=UserResponse,
    status_code=201
)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    try:
        new_user = User(
            name=user.name,
            email=user.email,
            bio=user.bio,
            password=hash_password(user.password)
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.get(
    "/users",
    response_model=list[UserResponse]
)
def get_users(
    limit: int = Query(10, le=100),
    offset: int = 0,
    db: Session = Depends(get_db)
):
    users = (
        db.query(User)
        .offset(offset)
        .limit(limit)
        .all()
    )

    return users
@router.get("/users/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user