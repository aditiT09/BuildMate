from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User

from app.schemas.user import UserCreate


router = APIRouter()


@router.post("/users")
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    new_user = User(

        name=user.name,

        email=user.email,

        bio=user.bio
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return new_user
@router.get("/users")
def get_users(
    db: Session = Depends(get_db)
):

    users = db.query(
        User
    ).all()

    return users