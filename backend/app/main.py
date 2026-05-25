from fastapi import FastAPI

from app.database import engine
from app.database import Base

from app.models.user import User
from app.models.skill import Skill
from app.models.user_skill import UserSkill

from app.models.project import Project
from app.models.project_skill import ProjectSkill

from app.models.opportunity import Opportunity
from app.models.application import Application

from app.routes.users import router as users_router
from app.routes.projects import router as projects_router
from app.routes import opportunity



Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(
    opportunity.router
)


app.include_router(users_router)

app.include_router(projects_router)


@app.get("/")
def home():

    return {
        "message": "BuildMate API running 🚀"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }