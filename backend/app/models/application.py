from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from app.database import Base


class Application(Base):

    __tablename__ = "applications"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    opportunity_id = Column(
        Integer,
        ForeignKey("opportunities.id")
    )

    status = Column(
        String,
        default="pending"
    )