"""add project resources

Revision ID: 7729356c95d9
Revises: a6bc8e88334a
Create Date: 2026-06-10 19:11:02.375150

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7729356c95d9'
down_revision: Union[str, Sequence[str], None] = 'a6bc8e88334a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Make required relationship columns non-nullable."""
    op.alter_column('applications', 'user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('applications', 'opportunity_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('opportunities', 'project_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('project_skills', 'project_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('project_skills', 'skill_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('projects', 'owner_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('user_skills', 'user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('user_skills', 'skill_id',
               existing_type=sa.INTEGER(),
               nullable=False)


def downgrade() -> None:
    """Restore the nullable columns from the previous revision."""
    op.alter_column('user_skills', 'skill_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('user_skills', 'user_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('projects', 'owner_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('project_skills', 'skill_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('project_skills', 'project_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('opportunities', 'project_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('applications', 'opportunity_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('applications', 'user_id',
               existing_type=sa.INTEGER(),
               nullable=True)
