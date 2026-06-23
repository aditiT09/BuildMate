import uuid
from app.models.user import User
from app.models.project import Project
from app.models.opportunity import Opportunity
from app.models.application import Application
from app.models.skill import Skill
from app.models.user_skill import UserSkill
from app.utils.scoring import recalculate_user_scores, update_activity_score

def test_scoring_baseline(db_session):
    # Setup fresh user with 0 projects, skills, applications
    user = User(
        name="Baseline User",
        email=f"scoring_{uuid.uuid4()}@test.com",
        password="hash",
        activity_score=0,
        reliability_score=0
    )
    db_session.add(user)
    db_session.commit()

    recalculate_user_scores(user, db_session)
    assert user.activity_score == 50
    assert user.reliability_score == 50

def test_scoring_incremental_and_clamping(db_session):
    # Setup user
    user = User(
        name="Incremental User",
        email=f"scoring_{uuid.uuid4()}@test.com",
        password="hash",
        activity_score=50,
        reliability_score=50
    )
    db_session.add(user)
    db_session.commit()

    # Add 1 project
    p1 = Project(title="Project 1", description="test", timeline="1 month", project_type="web", owner_id=user.id)
    db_session.add(p1)

    # Add 1 skill
    s1 = Skill(name=f"Skill_{uuid.uuid4()}")
    db_session.add(s1)
    db_session.commit()
    us1 = UserSkill(user_id=user.id, skill_id=s1.id)
    db_session.add(us1)

    # Add 1 application (pending)
    p2 = Project(title="Project 2", description="test", timeline="1 month", project_type="web", owner_id=user.id)
    db_session.add(p2)
    db_session.commit()
    opp = Opportunity(project_id=p2.id, role="Dev", seats=1, status="open")
    db_session.add(opp)
    db_session.commit()
    app = Application(opportunity_id=opp.id, user_id=user.id, status="pending")
    db_session.add(app)
    db_session.commit()

    # Recalculate
    db_session.refresh(user)
    # activity = 50 + (2 projects owned * 10) + (1 skill * 3) + (1 app * 5) = 78
    # reliability = 50 (0 accepted, 0 rejected) = 50
    recalculate_user_scores(user, db_session)
    assert user.activity_score == 78
    assert user.reliability_score == 50

    # Let's change application to accepted
    app.status = "accepted"
    db_session.commit()
    # reliability = 50 + 15 = 65
    db_session.refresh(user)
    recalculate_user_scores(user, db_session)
    assert user.reliability_score == 65

    # Change to rejected
    app.status = "rejected"
    db_session.commit()
    # reliability = 50 - 10 = 40
    db_session.refresh(user)
    recalculate_user_scores(user, db_session)
    assert user.reliability_score == 40

def test_scoring_upper_and_lower_clamping(db_session):
    user = User(
        name="Clamped User",
        email=f"scoring_{uuid.uuid4()}@test.com",
        password="hash",
        activity_score=50,
        reliability_score=50
    )
    db_session.add(user)
    db_session.commit()

    # Create 10 projects to push activity above 100
    for i in range(10):
        p = Project(title=f"Proj {i}", description="test", timeline="1m", project_type="web", owner_id=user.id)
        db_session.add(p)
    db_session.commit()

    db_session.refresh(user)
    # Recalculate: activity = 50 + 100 = 150 -> clamped to 100
    recalculate_user_scores(user, db_session)
    assert user.activity_score == 100

    # Create 6 rejected applications on 6 different opportunities to avoid unique constraint
    p_opp = Project(title="Opp Proj", description="test", timeline="1m", project_type="web", owner_id=user.id)
    db_session.add(p_opp)
    db_session.commit()

    for i in range(6):
        opp = Opportunity(project_id=p_opp.id, role=f"Dev {i}", seats=1, status="open")
        db_session.add(opp)
        db_session.commit()
        a = Application(opportunity_id=opp.id, user_id=user.id, status="rejected")
        db_session.add(a)
    db_session.commit()

    db_session.refresh(user)
    # Recalculate: reliability = 50 - 60 = -10 -> clamped to 0
    recalculate_user_scores(user, db_session)
    assert user.reliability_score == 0

def test_update_activity_score_util(db_session):
    user = User(
        name="Update Score User",
        email=f"scoring_{uuid.uuid4()}@test.com",
        password="hash",
        activity_score=50
    )
    db_session.add(user)
    db_session.commit()

    update_activity_score(user, 20, db_session)
    assert user.activity_score == 70

    update_activity_score(user, 50, db_session)
    assert user.activity_score == 100

    update_activity_score(user, -120, db_session)
    assert user.activity_score == 0
