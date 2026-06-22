from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import CheckConstraint
from sqlalchemy.orm import relationship
from app.database import Base
class User(Base):
    __tablename__ = "users"

    __table_args__ = (
        CheckConstraint(
            "activity_score >= 0 AND activity_score <= 100",
            name="check_user_activity_score"
        ),
        CheckConstraint(
            "reliability_score >= 0 AND reliability_score <= 100",
            name="check_user_reliability_score"
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(50),
        nullable=False,
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    bio = Column(
        String(500),
        nullable=True,
    )

    password = Column(
        String,
        nullable=False,
    )

    activity_score = Column(
        Integer,
        default=50,
    )

    reliability_score = Column(
        Integer,
        default=50,
    )

    skills = relationship(
        "UserSkill",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    projects = relationship(
        "Project",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    applications = relationship(
        "Application",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    invitations = relationship(
        "Invitation",
        back_populates="user",
        cascade="all, delete-orphan"
    )
 
