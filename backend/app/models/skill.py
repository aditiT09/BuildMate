from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import relationship

from app.database import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        unique=True,
        nullable=False
    )

    users = relationship(
        "UserSkill",
        back_populates="skill",
        cascade="all, delete-orphan"
    )

    projects = relationship(
        "ProjectSkill",
        back_populates="skill",
        cascade="all, delete-orphan"
    )