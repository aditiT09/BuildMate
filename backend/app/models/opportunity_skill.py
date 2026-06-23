from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import ForeignKey
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class OpportunitySkill(Base):
    __tablename__ = "opportunity_skills"

    __table_args__ = (
        UniqueConstraint(
            "opportunity_id",
            "skill_id",
            name="uq_opportunity_skill"
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    opportunity_id = Column(
        Integer,
        ForeignKey("opportunities.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    opportunity = relationship(
        "Opportunity",
        back_populates="skills"
    )

    skill = relationship(
        "Skill",
        back_populates="opportunities"
    )
