from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    timeline = Column(
        String
    )

    project_type = Column(
        String
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    owner = relationship(
        "User",
        back_populates="projects"
    )

    skills = relationship(
        "ProjectSkill",
        back_populates="project",
        cascade="all, delete-orphan"
    )

    opportunities = relationship(
        "Opportunity",
        back_populates="project",
        cascade="all, delete-orphan"
    )
    resources = relationship(
        "ProjectResource",
        back_populates="project",
        cascade="all, delete-orphan"
)