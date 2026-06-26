from pydantic import BaseModel, HttpUrl, Field
from enum import Enum


class ResourceType(str, Enum):
    GITHUB = "github"
    FIGMA = "figma"
    TRELLO = "trello"
    SLACK = "slack"
    DISCORD = "discord"
    OTHER = "other"
    GITHUB_CAP = "GitHub"
    DEMO = "Demo"
    GOOGLE_DRIVE = "Google Drive"
    NOTION = "Notion"
    PRESENTATION = "Presentation"
    OTHER_CAP = "Other"


class ProjectResourceCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    resource_type: ResourceType
    url: HttpUrl


class ProjectResourceResponse(ProjectResourceCreate):
    id: int
    project_id: int

    class Config:
        from_attributes = True