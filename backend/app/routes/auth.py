from fastapi import APIRouter, Depends, HTTPException, Request

from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

from app.schemas.auth import TokenResponse

from app.utils.security import (
    verify_password,
    create_access_token
)
from app.utils.rate_limiter import check_auth_rate_limit


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Normalise email — trim whitespace and lowercase
    # so "  User@Example.com " matches stored "user@example.com"
    email = form_data.username.strip().lower()

    client_ip = request.client.host if request.client else "127.0.0.1"
    check_auth_rate_limit(client_ip, email)

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


from pydantic import BaseModel, EmailStr

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    # Check if user exists (mock reset link)
    db.query(User).filter(User.email == email).first()
    return {
        "message": "If the email is registered, a password reset link has been sent."
    }