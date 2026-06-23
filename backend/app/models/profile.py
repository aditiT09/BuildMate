from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)

    full_name = Column(String, nullable=True)

    bio = Column(Text, nullable=True)

    college = Column(String, nullable=True)

    degree = Column(String, nullable=True)

    skills = Column(Text, nullable=True)

    github = Column(String, nullable=True)

    linkedin = Column(String, nullable=True)

    portfolio = Column(String, nullable=True)

    avatar = Column(String, nullable=True)

    availability = Column(String, nullable=True)

    user = relationship("User")

    @property
    def activity_score(self):
        return self.user.activity_score if self.user else 50

    @property
    def reliability_score(self):
        return self.user.reliability_score if self.user else 50

    @property
    def completeness_percentage(self):
        fields = [
            self.full_name,
            self.bio,
            self.college,
            self.github,
            self.linkedin,
            self.portfolio,
            self.availability
        ]
        completed = sum(1 for f in fields if f is not None and str(f).strip() != "")
        return int(round((completed / len(fields)) * 100))