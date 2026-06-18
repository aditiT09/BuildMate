"""repair profile and project resource tables

Revision ID: b7e2d4f1c9a0
Revises: 964875495079
Create Date: 2026-06-18

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b7e2d4f1c9a0"
down_revision: Union[str, Sequence[str], None] = "964875495079"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _index_names(inspector: sa.Inspector, table_name: str) -> set[str]:
    return {index["name"] for index in inspector.get_indexes(table_name)}


def upgrade() -> None:
    """Restore tables removed by earlier generated migrations, if needed."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    table_names = set(inspector.get_table_names())

    if "project_resources" not in table_names:
        op.create_table(
            "project_resources",
            sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
            sa.Column(
                "project_id",
                sa.Integer(),
                sa.ForeignKey("projects.id"),
                nullable=False,
            ),
            sa.Column("title", sa.String(), nullable=False),
            sa.Column("resource_type", sa.String(), nullable=False),
            sa.Column("url", sa.String(), nullable=False),
        )
        op.create_index(
            op.f("ix_project_resources_id"),
            "project_resources",
            ["id"],
            unique=False,
        )
    elif "ix_project_resources_id" not in _index_names(
        inspector, "project_resources"
    ):
        op.create_index(
            op.f("ix_project_resources_id"),
            "project_resources",
            ["id"],
            unique=False,
        )

    inspector = sa.inspect(bind)
    table_names = set(inspector.get_table_names())

    if "profiles" not in table_names:
        op.create_table(
            "profiles",
            sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
            sa.Column(
                "user_id",
                sa.Integer(),
                sa.ForeignKey("users.id"),
                nullable=True,
                unique=True,
            ),
            sa.Column("full_name", sa.String(), nullable=True),
            sa.Column("bio", sa.Text(), nullable=True),
            sa.Column("college", sa.String(), nullable=True),
            sa.Column("degree", sa.String(), nullable=True),
            sa.Column("skills", sa.Text(), nullable=True),
            sa.Column("github", sa.String(), nullable=True),
            sa.Column("linkedin", sa.String(), nullable=True),
            sa.Column("portfolio", sa.String(), nullable=True),
            sa.Column("avatar", sa.String(), nullable=True),
            sa.Column("availability", sa.String(), nullable=True),
        )
        op.create_index(
            op.f("ix_profiles_id"),
            "profiles",
            ["id"],
            unique=False,
        )
    elif "ix_profiles_id" not in _index_names(inspector, "profiles"):
        op.create_index(
            op.f("ix_profiles_id"),
            "profiles",
            ["id"],
            unique=False,
        )


def downgrade() -> None:
    # This repair may adopt pre-existing tables, so deleting them is unsafe.
    pass
