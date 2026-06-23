from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import UniqueConstraint
from sqlalchemy import CheckConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class Invitation(Base):
    __tablename__ = "invitations"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "opportunity_id",
            name="uq_invitation"
        ),
        CheckConstraint(
            "status IN ('pending', 'accepted', 'rejected')",
            name="check_invitation_status"
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

    opportunity_id = Column(
        Integer,
        ForeignKey("opportunities.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    status = Column(
        String,
        default="pending"  # pending, accepted, rejected
    )

    user = relationship(
        "User",
        back_populates="invitations"
    )

    opportunity = relationship(
        "Opportunity",
        back_populates="invitations"
    )
