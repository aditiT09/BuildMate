from pydantic import BaseModel, HttpUrl, Field


class ProfileCreate(BaseModel):
    full_name: str | None = Field(
        default=None,
        max_length=100
    )

    bio: str | None = Field(
        default=None,
        max_length=500
    )

    college: str | None = Field(
        default=None,
        max_length=100
    )

    degree: str | None = Field(
        default=None,
        max_length=100
    )

    skills: str | None = Field(
        default=None,
        max_length=500
    )

    github: HttpUrl | None = None
    linkedin: HttpUrl | None = None
    portfolio: HttpUrl | None = None

    avatar: str | None = Field(
        default=None,
        max_length=500
    )

    availability: str | None = Field(
        default=None,
        max_length=100
    )


class ProfileOut(ProfileCreate):
    id: int
    user_id: int
    activity_score: int
    reliability_score: int

    class Config:
        from_attributes = True