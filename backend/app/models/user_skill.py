from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class UserSkill(Base):

    __tablename__ = "user_skills"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id")
    )

    user = relationship(
        "User",
        back_populates="skills"
    )

    skill = relationship(
        "Skill",
        back_populates="users"
    )