from fastapi import FastAPI

from app.database import engine
from app.database import Base

from app.models.user import User
from app.models.skill import Skill
from app.models.user_skill import UserSkill

from app.models.project import Project
from app.models.project_skill import ProjectSkill

from app.models.opportunity import Opportunity
from app.models.opportunity_skill import OpportunitySkill
from app.models.application import Application
from app.models.invitation import Invitation

from app.routes.users import router as users_router
from app.routes.projects import router as projects_router
from app.routes import opportunity
from app.routes import application
from app.routes import auth
from app.routes import matching
from app.routes import skill
from app.routes import user_skill
from app.routes import project_skill
from app.routes import opportunity_skill
from app.routes import invitation
from app.routes import recommendation
from app.routes import analytics
from app.routes import ranking
from app.routes import explanation
from app.routes import applicant_ranking
from fastapi.middleware.cors import CORSMiddleware
from app.models.profile import Profile

from app.routes import profile
from app.models.project_resource import ProjectResource
from app.routes import profile
from app.routes import project_resource
from app.core.exception_handlers import register_exception_handlers
app = FastAPI()
register_exception_handlers(app)
app.include_router(
    project_resource.router
)
# Database schema managed by Alembic
# Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "https://buildmate-frontend-khaki.vercel.app",
    "https://buildmate-frontend-git-main-adititiwari095-8972-projects.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(
    applicant_ranking.router
)
app.include_router(
    explanation.router
)
app.include_router(
    ranking.router
)


app.include_router(analytics.router)

app.include_router(
    recommendation.router
)
app.include_router(
    project_skill.router
)
app.include_router(
    opportunity_skill.router
)
app.include_router(
    invitation.router
)
app.include_router(
    user_skill.router
)
app.include_router(
    skill.router
)
app.include_router(
    matching.router
)


app.include_router(
    auth.router
)
app.include_router(
    opportunity.router
)
app.include_router(
    application.router
)

app.include_router(users_router)

app.include_router(projects_router)
app.include_router(
    profile.router,
    prefix="/profile",
    tags=["Profile"]
)


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


from pydantic import BaseModel, EmailStr

class SubscribeRequest(BaseModel):
    email: EmailStr

@app.post("/subscribe")
def subscribe(payload: SubscribeRequest):
    return {
        "message": "Subscription successful"
    }