from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from app.database import Base


class Opportunity(Base):

    __tablename__ = "opportunities"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    role = Column(
        String,
        nullable=False
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id")
    )

    seats = Column(
        Integer,
        default=1
    )

    status = Column(
        String,
        default="open"
    )