import os
import pytest
import dotenv
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

# Load the test environment configuration
dotenv.load_dotenv(".env.test")

import fnmatch
from app.config import settings

# Global mock store for Redis
mock_redis_store = {}

def mock_get(key):
    return mock_redis_store.get(key)

def mock_set(key, value, *args, **kwargs):
    mock_redis_store[key] = str(value)
    return True

def mock_setex(key, time, value):
    mock_redis_store[key] = str(value)
    return True

def mock_delete(*keys):
    count = 0
    for k in keys:
        if k in mock_redis_store:
            del mock_redis_store[k]
            count += 1
    return count

def mock_scan_iter(match=None):
    if match is None:
        return iter(mock_redis_store.keys())
    return iter([k for k in mock_redis_store.keys() if fnmatch.fnmatch(k, match)])

# Mock the redis_client globally at startup
from app.utils.redis_client import redis_client
redis_client.get = mock_get
redis_client.set = mock_set
redis_client.setex = mock_setex
redis_client.delete = mock_delete
redis_client.scan_iter = mock_scan_iter

@pytest.fixture(autouse=True)
def clean_redis():
    mock_redis_store.clear()
    yield
    mock_redis_store.clear()

from app.database import get_db, Base
from app.main import app

if not getattr(settings, "TESTING", False):
    raise RuntimeError("Tests must run with TESTING = True in the environment (.env.test).")

if not settings.TEST_DATABASE_URL or "test" not in str(settings.TEST_DATABASE_URL).lower():
    raise RuntimeError(
        f"Database URL guard failed: settings.TEST_DATABASE_URL ({settings.TEST_DATABASE_URL}) "
        "does not contain 'test'. Tests must run against a test database."
    )

engine = create_engine(
    settings.TEST_DATABASE_URL
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="session", autouse=True)
def setup_database_tables():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(autouse=True)
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    # Start a nested ORM transaction (savepoint)
    session.begin_nested()

    # Automatically restart the savepoint nested transaction if closed by an endpoint commit/rollback
    @event.listens_for(session, "after_transaction_end")
    def restart_savepoint(sess, trans):
        if trans.nested:
            sess.begin_nested()

    # Standard python function wrapper for FastAPI dependency (non-fixture)
    def mock_get_db():
        try:
            yield session
        finally:
            pass

    app.dependency_overrides[get_db] = mock_get_db
    yield session

    session.close()
    transaction.rollback()
    connection.close()
    app.dependency_overrides.pop(get_db, None)



client = TestClient(app)
