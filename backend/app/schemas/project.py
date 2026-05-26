from pydantic import BaseModel


class ProjectCreate(BaseModel):

    title: str

    description: str

    timeline: str

    project_type: str

    


class ProjectResponse(BaseModel):

    id: int

    title: str

    description: str

    timeline: str

    project_type: str

    owner_id: int

    class Config:

        from_attributes = True