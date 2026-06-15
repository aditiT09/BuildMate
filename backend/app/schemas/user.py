import re

from pydantic import (
    BaseModel,
    EmailStr,
    field_validator,
)

PASSWORD_REGEX = (
    r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
)


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    bio: str | None = None
    password: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str):
        value = " ".join(value.split())

        if len(value) < 2:
            raise ValueError(
                "Name must be at least 2 characters."
            )

        if len(value) > 50:
            raise ValueError(
                "Name cannot exceed 50 characters."
            )

        return value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr):
        return value.strip().lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str):
        if not re.match(
            PASSWORD_REGEX,
            value
        ):
            raise ValueError(
                "Password must contain uppercase, lowercase, a number, and be at least 8 characters."
            )

        return value

    @field_validator("bio")
    @classmethod
    def validate_bio(cls, value):
        if value is None:
            return None

        value = value.strip()

        if len(value) > 500:
            raise ValueError(
                "Bio cannot exceed 500 characters."
            )

        return value


class UserUpdate(BaseModel):
    name: str
    bio: str | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, value):
        value = " ".join(value.split())

        if len(value) < 2:
            raise ValueError(
                "Name must be at least 2 characters."
            )

        if len(value) > 50:
            raise ValueError(
                "Name cannot exceed 50 characters."
            )

        return value

    @field_validator("bio")
    @classmethod
    def validate_bio(cls, value):
        if value is None:
            return None

        value = value.strip()

        if len(value) > 500:
            raise ValueError(
                "Bio cannot exceed 500 characters."
            )

        return value


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    bio: str | None = None

    activity_score: int
    reliability_score: int

    class Config:
        from_attributes = True
