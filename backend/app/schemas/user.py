from pydantic import BaseModel


class UserCreate(BaseModel):

    name: str

    email: str

    bio: str

    password: str


class UserResponse(BaseModel):

    id: int

    name: str

    email: str

    bio: str

    class Config:

        from_attributes = True