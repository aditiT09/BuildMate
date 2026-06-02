from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    opportunity_id: int


class ProjectSummary(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True


class OpportunitySummary(BaseModel):
    id: int
    role: str
    project: ProjectSummary

    class Config:
        from_attributes = True

class UserSummary(BaseModel):
    id: int
    name: str
    email: str
    bio: str | None = None

    class Config:
        from_attributes = True


class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    opportunity_id: int
    status: str

    user: UserSummary

    opportunity: OpportunitySummary

    class Config:
        from_attributes = True