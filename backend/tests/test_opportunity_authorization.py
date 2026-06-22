from tests.conftest import client
from tests.helpers import (
    create_user,
    login_user,
    auth_headers
)

def test_cross_project_opportunity_reassignment_blocked():
    # User A creates project A and opportunity A
    user_a = create_user()
    token_a = login_user(user_a["email"])
    
    project_a = client.post(
        "/projects",
        json={
            "title": "Project A",
            "description": "Test",
            "timeline": "2 months",
            "project_type": "Web"
        },
        headers=auth_headers(token_a)
    ).json()

    opportunity_a = client.post(
        "/opportunities/",
        json={
            "role": "Frontend Developer",
            "project_id": project_a["id"],
            "seats": 2,
            "status": "open"
        },
        headers=auth_headers(token_a)
    ).json()

    # User B creates project B
    user_b = create_user()
    token_b = login_user(user_b["email"])

    project_b = client.post(
        "/projects",
        json={
            "title": "Project B",
            "description": "Test",
            "timeline": "3 months",
            "project_type": "Mobile"
        },
        headers=auth_headers(token_b)
    ).json()

    # User A attempts to update opportunity A by reassigning it to Project B (which User A does not own)
    response = client.put(
        f"/opportunities/{opportunity_a['id']}",
        json={
            "role": "Frontend Developer",
            "project_id": project_b["id"],
            "seats": 2,
            "status": "open"
        },
        headers=auth_headers(token_a)
    )

    # The request must be blocked with 403 Forbidden
    assert response.status_code == 403
