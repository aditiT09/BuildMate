"""merge heads

Revision ID: 0af6b158c386
Revises: 3a6aa5a60dd9, 95ef0c14614d, a448598c7742
Create Date: 2026-06-16 19:16:22.042488

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0af6b158c386'
down_revision: Union[str, Sequence[str], None] = ('3a6aa5a60dd9', '95ef0c14614d', 'a448598c7742')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
