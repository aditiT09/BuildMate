import pytest
import uuid
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.models.project import Project
from app.models.opportunity import Opportunity

def test_user_activity_score_constraint_low(db_session):
    user = User(
        name="Invalid User",
        email=f"{uuid.uuid4()}@test.com",
        password="hash",
        activity_score=-5,
        reliability_score=50
    )
    db_session.add(user)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

def test_user_activity_score_constraint_high(db_session):
    user = User(
        name="Invalid User",
        email=f"{uuid.uuid4()}@test.com",
        password="hash",
        activity_score=105,
        reliability_score=50
    )
    db_session.add(user)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

def test_user_reliability_score_constraint_low(db_session):
    user = User(
        name="Invalid User",
        email=f"{uuid.uuid4()}@test.com",
        password="hash",
        activity_score=50,
        reliability_score=-1
    )
    db_session.add(user)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

def test_user_reliability_score_constraint_high(db_session):
    user = User(
        name="Invalid User",
        email=f"{uuid.uuid4()}@test.com",
        password="hash",
        activity_score=50,
        reliability_score=101
    )
    db_session.add(user)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

def test_opportunity_seats_constraint(db_session):
    # Setup owner & project
    owner = User(
        name="Owner User",
        email=f"{uuid.uuid4()}@test.com",
        password="hash"
    )
    db_session.add(owner)
    db_session.commit()

    project = Project(
        title=f"Test Project {uuid.uuid4()}",
        description="A test project.",
        timeline="1 month",
        project_type="Testing",
        owner_id=owner.id
    )
    db_session.add(project)
    db_session.commit()

    # Create invalid opportunity (seats = 0)
    opp = Opportunity(
        project_id=project.id,
        role="Developer",
        seats=0,
        status="open"
    )
    db_session.add(opp)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

def test_opportunity_status_constraint(db_session):
    # Setup owner & project
    owner = User(
        name="Owner User",
        email=f"{uuid.uuid4()}@test.com",
        password="hash"
    )
    db_session.add(owner)
    db_session.commit()

    project = Project(
        title=f"Test Project {uuid.uuid4()}",
        description="A test project.",
        timeline="1 month",
        project_type="Testing",
        owner_id=owner.id
    )
    db_session.add(project)
    db_session.commit()

    # Create invalid opportunity (status = 'invalid')
    opp = Opportunity(
        project_id=project.id,
        role="Developer",
        seats=2,
        status="invalid_status"
    )
    db_session.add(opp)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()
