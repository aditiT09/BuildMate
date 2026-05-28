from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session


from app.database import get_db

from app.models.user import User

from app.schemas.user import UserCreate
from app.utils.security import hash_password
from fastapi import Query
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException


router = APIRouter()
@router.post("/users")
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

        return {
            "message": "user created"
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.get("/users")
def get_users(

    limit: int = Query(10, le=100),
    offset: int = 0,

    db: Session = Depends(get_db)

):

    users = db.query(User)\
        .offset(offset)\
        .limit(limit)\
        .all()

    return users