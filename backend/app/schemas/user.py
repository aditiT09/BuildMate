from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str
    bio: str | None = None
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    bio: str | None = None

    class Config:
        from_attributes = True
class UserUpdate(BaseModel):
    name: str
    bio: str | None = None
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    bio: str | None = None

    activity_score: int
    reliability_score: int

    class Config:
        from_attributes = True