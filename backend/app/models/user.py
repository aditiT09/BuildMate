from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import relationship
from app.database import Base
class User(Base):
    __tablename__ = "users"

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
    )

    projects = relationship(
        "Project",
        back_populates="owner",
    )

    applications = relationship(
        "Application",
        back_populates="user",
    )
 
