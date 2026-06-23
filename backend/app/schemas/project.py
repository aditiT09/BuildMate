from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)

    description: str = Field(
        ...,
        min_length=20,
        max_length=5000
    )

    timeline: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    project_type: str = Field(
        ...,
        min_length=2,
        max_length=50
    )


class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str
    timeline: str
    project_type: str
    owner_id: int

    class Config:
        from_attributes = True