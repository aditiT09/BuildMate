from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class Application(Base):
    __tablename__ = "applications"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "opportunity_id",
            name="uq_application"
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    opportunity_id = Column(
        Integer,
        ForeignKey("opportunities.id"),
        nullable=False
    )

    status = Column(
        String,
        default="pending"
    )

    user = relationship(
        "User",
        back_populates="applications"
    )

    opportunity = relationship(
        "Opportunity",
        back_populates="applications"
    )