from pydantic import BaseModel


class ProjectResourceCreate(BaseModel):
    title: str
    resource_type: str
    url: str


class ProjectResourceResponse(ProjectResourceCreate):
    id: int
    project_id: int

    class Config:
        from_attributes = True