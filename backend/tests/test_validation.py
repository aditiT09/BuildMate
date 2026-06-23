from tests.conftest import client
from tests.helpers import (
    create_user,
    login_user,
    auth_headers
)

def test_project_input_validation():
    owner = create_user()
    owner_token = login_user(owner["email"])
    owner_headers = auth_headers(owner_token)

    # 1. Title too short (< 3 characters) -> 422
    resp = client.post(
        "/projects",
        json={
            "title": "AB",
            "description": "This is a project description containing more than 20 characters.",
            "timeline": "3 months",
            "project_type": "Data Science"
        },
        headers=owner_headers
    )
    assert resp.status_code == 422

    # 2. Description too short (< 20 characters) -> 422
    resp = client.post(
        "/projects",
        json={
            "title": "Valid Title",
            "description": "Too short",
            "timeline": "3 months",
            "project_type": "Data Science"
        },
        headers=owner_headers
    )
    assert resp.status_code == 422


def test_opportunity_input_validation():
    owner = create_user()
    owner_token = login_user(owner["email"])
    owner_headers = auth_headers(owner_token)

    project = client.post(
        "/projects",
        json={
            "title": "Valid Project Title",
            "description": "This is a project description containing more than 20 characters.",
            "timeline": "3 months",
            "project_type": "Data Science"
        },
        headers=owner_headers
    ).json()

    # 1. Seats too low (0) -> 422
    resp = client.post(
        "/opportunities",
        json={
            "project_id": project["id"],
            "role": "Developer",
            "seats": 0,
            "status": "open"
        },
        headers=owner_headers
    )
    assert resp.status_code == 422

    # 2. Seats too high (101) -> 422
    resp = client.post(
        "/opportunities",
        json={
            "project_id": project["id"],
            "role": "Developer",
            "seats": 101,
            "status": "open"
        },
        headers=owner_headers
    )
    assert resp.status_code == 422


def test_user_email_validation():
    # Invalid email format -> 422
    resp = client.post(
        "/users",
        json={
            "name": "Invalid Email User",
            "email": "not-an-email",
            "bio": "test",
            "password": "Password123"
        }
    )
    assert resp.status_code == 422
