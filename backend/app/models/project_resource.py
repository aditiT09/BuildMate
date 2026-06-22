from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from app.database import Base


class ProjectResource(Base):
    __tablename__ = "project_resources"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False
    )

    title = Column(
        String,
        nullable=False
    )

    resource_type = Column(
        String,
        nullable=False
    )

    url = Column(
        String,
        nullable=False
    )

    project = relationship(
        "Project",
        back_populates="resources"
    )