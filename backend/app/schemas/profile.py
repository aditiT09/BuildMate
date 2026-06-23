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

    github: str | None = None
    linkedin: str | None = None
    portfolio: str | None = None

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
    completeness_percentage: int

    class Config:
        from_attributes = True