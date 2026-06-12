"""create project_resources table

Revision ID: a448598c7742
Revises: 7729356c95d9
Create Date: 2026-06-11 10:36:15.803022

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a448598c7742'
down_revision: Union[str, Sequence[str], None] = '7729356c95d9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
