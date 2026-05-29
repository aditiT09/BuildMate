"""add user scores

Revision ID: 58ced5351e21
Revises: a0b7c81d6081
Create Date: 2026-05-29 22:08:02.066568

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '58ced5351e21'
down_revision: Union[str, Sequence[str], None] = 'a0b7c81d6081'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
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
    # ### end Alembic commands ###
