from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.database import Base
from sqlalchemy.orm import relationship

users = relationship(
    "User",
    secondary="user_skills"
)

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