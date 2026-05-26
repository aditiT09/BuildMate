from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.database import Base
from sqlalchemy.orm import relationship

skills = relationship(
    "Skill",
    secondary="user_skills"
)


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    bio = Column(
        String
    )
    password = Column(
    String,
    nullable=False
)