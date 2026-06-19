from pydantic import BaseModel


class ProfileCreate(BaseModel):
    full_name: str | None = None
    bio: str | None = None
    college: str | None = None
    degree: str | None = None
    skills: str | None = None
    github: str | None = None
    linkedin: str | None = None
    portfolio: str | None = None
    avatar: str | None = None
    availability: str | None = None


class ProfileOut(ProfileCreate):
    id: int
    user_id: int
    activity_score: int
    reliability_score: int

    class Config:
        from_attributes = True