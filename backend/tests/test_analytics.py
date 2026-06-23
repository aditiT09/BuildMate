import uuid
from tests.conftest import client
from app.models.user import User
from app.models.project import Project
from app.models.opportunity import Opportunity
from app.models.application import Application

def test_analytics_overview(db_session):
    # 1. Setup 3 users
    users = []
    for i in range(3):
        user = User(
            name=f"User {i}",
            email=f"analytics_{uuid.uuid4()}@test.com",
            password="hash"
        )
        db_session.add(user)
        users.append(user)
    db_session.commit()

    # 2. Setup 2 projects (both owned by users[0])
    p1 = Project(
        title="Project 1",
        description="test",
        timeline="1 month",
        project_type="web",
        owner_id=users[0].id
    )
    p2 = Project(
        title="Project 2",
        description="test",
        timeline="1 month",
        project_type="web",
        owner_id=users[0].id
    )
    db_session.add_all([p1, p2])
    db_session.commit()

    # 3. Setup 3 opportunities
    o1 = Opportunity(project_id=p1.id, role="Role 1", seats=2, status="open")
    o2 = Opportunity(project_id=p1.id, role="Role 2", seats=1, status="open")
    o3 = Opportunity(project_id=p2.id, role="Role 3", seats=1, status="open")
    db_session.add_all([o1, o2, o3])
    db_session.commit()

    # 4. Setup 5 applications
    # 2 accepted
    a1 = Application(opportunity_id=o1.id, user_id=users[1].id, status="accepted")
    a2 = Application(opportunity_id=o2.id, user_id=users[2].id, status="accepted")
    # 2 pending
    a3 = Application(opportunity_id=o1.id, user_id=users[2].id, status="pending")
    a4 = Application(opportunity_id=o3.id, user_id=users[1].id, status="pending")
    # 1 rejected
    a5 = Application(opportunity_id=o3.id, user_id=users[2].id, status="rejected")

    db_session.add_all([a1, a2, a3, a4, a5])
    db_session.commit()

    # 5. Query analytics overview
    resp = client.get("/analytics/overview")
    assert resp.status_code == 200
    data = resp.json()

    # Verify counts
    # Since other tests might run in parallel or have created users in setup,
    # let's fetch current baseline and verify the increase, or since db_session
    # isolates us in a clean nested transaction, there are only the records
    # we created in this session! So we can assert exact numbers!
    assert data["total_users"] == 3
    assert data["total_projects"] == 2
    assert data["total_opportunities"] == 3
    assert data["total_applications"] == 5
    assert data["accepted_applications"] == 2
    assert data["pending_applications"] == 2
    assert data["rejected_applications"] == 1
