from pydantic import BaseModel, HttpUrl, Field
from enum import Enum


class ResourceType(str, Enum):
    GITHUB = "github"
    FIGMA = "figma"
    TRELLO = "trello"
    SLACK = "slack"
    DISCORD = "discord"
    OTHER = "other"


class ProjectResourceCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    resource_type: ResourceType
    url: HttpUrl


class ProjectResourceResponse(ProjectResourceCreate):
    id: int
    project_id: int

    class Config:
        from_attributes = True