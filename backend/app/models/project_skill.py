from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class ProjectSkill(Base):
    __tablename__ = "project_skills"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
        nullable=False
    )

    project = relationship(
        "Project",
        back_populates="skills"
    )

    skill = relationship(
        "Skill",
        back_populates="projects"
    )