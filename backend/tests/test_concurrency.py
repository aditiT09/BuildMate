import threading
import uuid
import pytest
from tests.conftest import client, TestingSessionLocal
from tests.helpers import create_user, login_user, auth_headers
from app.database import get_db
from app.models.application import Application
from app.models.opportunity import Opportunity
from app.models.project import Project
from app.models.user import User
from app.main import app

@pytest.fixture(autouse=True)
def db_session():
    # Override conftest's db_session to commit writes so threads can see them
    session = TestingSessionLocal()
    
    def mock_get_db():
        try:
            yield session
        finally:
            pass
            
    app.dependency_overrides[get_db] = mock_get_db
    yield session
    
    session.close()
    app.dependency_overrides.pop(get_db, None)

def test_concurrent_accept_application():
    # 1. Setup owner & 3 candidates
    owner = create_user()
    owner_token = login_user(owner["email"])
    owner_headers = auth_headers(owner_token)

    candidates = [create_user() for _ in range(3)]
    candidate_tokens = [login_user(c["email"]) for c in candidates]
    candidate_headers_list = [auth_headers(tok) for tok in candidate_tokens]

    # Create project
    proj_resp = client.post(
        "/projects",
        json={
            "title": f"Concurrency Project {uuid.uuid4()}",
            "description": "Test concurrent requests.",
            "timeline": "1 month",
            "project_type": "Testing"
        },
        headers=owner_headers
    )
    assert proj_resp.status_code in [200, 201]
    project = proj_resp.json()

    # Create opportunity with 1 seat
    opp_resp = client.post(
        "/opportunities",
        json={
            "project_id": project["id"],
            "role": "QA Engineer",
            "seats": 1,
            "status": "open"
        },
        headers=owner_headers
    )
    assert opp_resp.status_code in [200, 201]
    opportunity = opp_resp.json()

    # Candidates apply
    app_ids = []
    for headers in candidate_headers_list:
        app_resp = client.post(
            "/applications",
            json={"opportunity_id": opportunity["id"]},
            headers=headers
        )
        assert app_resp.status_code in [200, 201]
        app_ids.append(app_resp.json()["id"])

    # 2. Use thread-local DB override for true database isolation per concurrent request
    def override_db_concurrency():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_db_concurrency

    # 3. Spawn 3 threads to concurrently call accept on each application
    results = []
    barrier = threading.Barrier(3)

    def worker(app_id):
        # Wait on barrier to synchronize thread start
        barrier.wait()
        # Make request to accept
        resp = client.put(
            f"/applications/{app_id}/accept",
            headers=owner_headers
        )
        results.append((app_id, resp.status_code, resp.json()))

    threads = []
    for app_id in app_ids:
        t = threading.Thread(target=worker, args=(app_id,))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    # 4. Assertions
    # Restoring the overrides first
    app.dependency_overrides.pop(get_db, None)

    success_responses = [r for r in results if r[1] == 200]
    failed_responses = [r for r in results if r[1] == 400]

    # Print results to console on failure
    print(f"CONCURRENCY RESULTS: {results}")

    # Verify exactly 1 succeeded and others failed
    assert len(success_responses) == 1, f"Expected 1 success, got results: {results}"
    assert len(failed_responses) == 2, f"Expected 2 failures, got results: {results}"

    for fail in failed_responses:
        assert fail[2]["detail"] in ["No seats remaining", "Application already processed"]

    # Verify opportunity is now closed and only 1 application is accepted in the DB
    db = TestingSessionLocal()
    try:
        updated_opp = db.query(Opportunity).filter(Opportunity.id == opportunity["id"]).first()
        assert updated_opp.status == "closed"

        accepted_apps = db.query(Application).filter(
            Application.opportunity_id == opportunity["id"],
            Application.status == "accepted"
        ).all()
        assert len(accepted_apps) == 1

        # Clean up database records created for this test
        db.query(Application).filter(Application.opportunity_id == opportunity["id"]).delete()
        db.query(Opportunity).filter(Opportunity.id == opportunity["id"]).delete()
        db.query(Project).filter(Project.id == project["id"]).delete()
        db.query(User).filter(User.id.in_([owner["id"]] + [c["id"] for c in candidates])).delete()
        db.commit()
    finally:
        db.close()
