import os
import pytest
from sqlalchemy import create_engine, text
from alembic.config import Config
from alembic import command
from app.config import settings

def test_migration_chain():
    # 1. Prepare URLs
    base_url, db_name = settings.TEST_DATABASE_URL.rsplit('/', 1)
    admin_url = f"{base_url}/postgres"
    temp_db_name = "temp_migration_test"
    temp_db_url = f"{base_url}/{temp_db_name}"

    # 2. Create the temporary database
    admin_engine = create_engine(admin_url, isolation_level="AUTOCOMMIT")
    with admin_engine.connect() as conn:
        # Drop first if it already exists from a previous crash
        try:
            conn.execute(text(f"DROP DATABASE IF EXISTS {temp_db_name} WITH (FORCE)"))
        except Exception:
            pass
        conn.execute(text(f"CREATE DATABASE {temp_db_name}"))

    
    # 3. Run migrations on temp_db
    try:
        # Load Alembic configuration
        alembic_cfg = Config("alembic.ini")

        # Use temporary database during migration testing
        os.environ["DATABASE_URL"] = temp_db_url

        # Upgrade to head
        command.upgrade(alembic_cfg, "head")

        # Downgrade to base
        command.downgrade(alembic_cfg, "base")
  
        # Upgrade back to head
        command.upgrade(alembic_cfg, "head")

    finally:
        # Remove temporary environment variable
        os.environ.pop("DATABASE_URL", None)

        # Drop temporary database
        with admin_engine.connect() as conn:
            try:
                conn.execute(
                    text(f"DROP DATABASE IF EXISTS {temp_db_name} WITH (FORCE)")
            )
            except Exception as e:
                print(f"Error dropping temp database: {e}")

        admin_engine.dispose()