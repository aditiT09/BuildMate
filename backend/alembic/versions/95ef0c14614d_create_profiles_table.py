"""create profiles table

Revision ID: 95ef0c14614d
Revises: 033dd54554da
Create Date: 2026-06-11 22:11:02.607616

"""
from typing import Sequence, Union

# revision identifiers, used by Alembic.
revision: str = '95ef0c14614d'
down_revision: Union[str, Sequence[str], None] = '033dd54554da'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Retained as a no-op branch revision for migration compatibility."""


def downgrade() -> None:
    """No schema changes were made by this compatibility revision."""
