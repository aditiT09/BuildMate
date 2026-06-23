from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import ForeignKey
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class UserSkill(Base):
    __tablename__ = "user_skills"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "skill_id",
            name="uq_user_skill"
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    user = relationship(
        "User",
        back_populates="skills"
    )

    skill = relationship(
        "Skill",
        back_populates="users"
    )