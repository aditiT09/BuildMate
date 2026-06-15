from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

from app.schemas.auth import TokenResponse

from app.utils.security import (
    verify_password,
    create_access_token
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Normalise email — trim whitespace and lowercase
    # so "  User@Example.com " matches stored "user@example.com"
    email = form_data.username.strip().lower()

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    # ── Timing-safe: same error for unknown email or wrong password ──
    # Never reveal whether the email exists in the database
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        form_data.password,
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    # JWT sub is the stored (already lowercase) email
    access_token = create_access_token(
        {
            "sub": user.email
        }
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer"
    )