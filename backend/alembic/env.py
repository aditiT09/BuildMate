from logging.config import fileConfig
import os

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

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
from app.models.profile import Profile
from app.models.project_resource import ProjectResource
from app.config import settings

config = context.config

# ----------------------------------------------------
# Database URL Resolution Priority
#
# 1. DATABASE_URL environment variable (CI / Production)
# 2. URL passed by Alembic Config (tests)
# 3. Application settings (local development)
# ----------------------------------------------------

database_url = os.getenv("DATABASE_URL")

if not database_url:
    database_url = config.get_main_option("sqlalchemy.url")

if (
    not database_url
    or database_url == "postgresql://postgres:postgres@postgres:5432/buildmate"
):
    database_url = settings.DATABASE_URL

config.set_main_option("sqlalchemy.url", database_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata