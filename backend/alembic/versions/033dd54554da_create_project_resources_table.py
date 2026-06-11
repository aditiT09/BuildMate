from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision = "033dd54554da"
down_revision = "7729356c95d9"
branch_labels = None
depends_on = None


def upgrade():

    op.create_table(
        "project_resources",

        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
            nullable=False,
        ),

        sa.Column(
            "project_id",
            sa.Integer(),
            sa.ForeignKey("projects.id"),
            nullable=False,
        ),

        sa.Column(
            "title",
            sa.String(),
            nullable=False,
        ),

        sa.Column(
            "resource_type",
            sa.String(),
            nullable=False,
        ),

        sa.Column(
            "url",
            sa.String(),
            nullable=False,
        ),
    )

    op.create_index(
        op.f("ix_project_resources_id"),
        "project_resources",
        ["id"],
        unique=False,
    )


def downgrade():

    op.drop_index(
        op.f("ix_project_resources_id"),
        table_name="project_resources",
    )

    op.drop_table("project_resources")