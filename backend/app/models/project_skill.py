from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import ForeignKey
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class ProjectSkill(Base):
    __tablename__ = "project_skills"

    __table_args__ = (
        UniqueConstraint(
            "project_id",
            "skill_id",
            name="uq_project_skill"
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    project = relationship(
        "Project",
        back_populates="skills"
    )

    skill = relationship(
        "Skill",
        back_populates="projects"
    )