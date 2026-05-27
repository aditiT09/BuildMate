"""add activity and reliability score

Revision ID: a567ea955992
Revises: b86ccc14de0a
Create Date: 2026-05-27 23:05:57.729589

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a567ea955992'
down_revision: Union[str, Sequence[str], None] = 'b86ccc14de0a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.add_column(
        'users',
        sa.Column(
            'activity_score',
            sa.Integer(),
            nullable=True
        )
    )

    op.add_column(
        'users',
        sa.Column(
            'reliability_score',
            sa.Integer(),
            nullable=True
        )
    )


def downgrade() -> None:

    op.drop_column(
        'users',
        'reliability_score'
    )

    op.drop_column(
        'users',
        'activity_score'
    )