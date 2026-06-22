# tests/test_applications.py

from tests.conftest import client
from tests.helpers import (
    create_user,
    login_user,
    auth_headers
)


def test_apply():

    owner = create_user()

    owner_token = login_user(owner["email"])

    project = client.post(
        "/projects",
        json={
            "title": "Project A",
            "description": "Test Project Long Description with 20+ characters",
            "timeline": "2 months",
            "project_type": "Web"
        },
        headers=auth_headers(owner_token)
    ).json()

    opportunity = client.post(
        "/opportunities/",
        json={
            "role": "Frontend",
            "project_id": project["id"],
            "seats": 1,
            "status": "open"
        },
        headers=auth_headers(owner_token)
    ).json()

    applicant = create_user()

    applicant_token = login_user(
        applicant["email"]
    )

    response = client.post(
        "/applications/",
        json={
            "opportunity_id": opportunity["id"]
        },
        headers=auth_headers(applicant_token)
    )

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "pending"

    assert (
        data["opportunity_id"]
        == opportunity["id"]
    )
def test_duplicate_application():

    owner = create_user()
    owner_token = login_user(owner["email"])

    project = client.post(
        "/projects",
        json={
            "title": "Project A",
            "description": "Test Project Long Description with 20+ characters",
            "timeline": "2 months",
            "project_type": "Web"
        },
        headers=auth_headers(owner_token)
    ).json()

    opportunity = client.post(
        "/opportunities/",
        json={
            "role": "Frontend",
            "project_id": project["id"],
            "seats": 1,
            "status": "open"
        },
        headers=auth_headers(owner_token)
    ).json()

    applicant = create_user()
    applicant_token = login_user(applicant["email"])

    first = client.post(
        "/applications/",
        json={
            "opportunity_id": opportunity["id"]
        },
        headers=auth_headers(applicant_token)
    )

    assert first.status_code == 200

    second = client.post(
        "/applications/",
        json={
            "opportunity_id": opportunity["id"]
        },
        headers=auth_headers(applicant_token)
    )

    assert second.status_code == 400
    assert second.json()["detail"] == "Already applied"
def test_accept_application():

    owner = create_user()
    owner_token = login_user(owner["email"])

    project = client.post(
        "/projects",
        json={
            "title": "Project A",
            "description": "Test Project Long Description with 20+ characters",
            "timeline": "2 months",
            "project_type": "Web"
        },
        headers=auth_headers(owner_token)
    ).json()

    opportunity = client.post(
        "/opportunities/",
        json={
            "role": "Frontend",
            "project_id": project["id"],
            "seats": 1,
            "status": "open"
        },
        headers=auth_headers(owner_token)
    ).json()

    applicant = create_user()
    applicant_token = login_user(applicant["email"])

    application = client.post(
        "/applications/",
        json={
            "opportunity_id": opportunity["id"]
        },
        headers=auth_headers(applicant_token)
    ).json()

    response = client.put(
        f"/applications/{application['id']}/accept",
        headers=auth_headers(owner_token)
    )

    assert response.status_code == 200
    assert response.json()["status"] == "accepted"
def test_reject_application():

    owner = create_user()
    owner_token = login_user(owner["email"])

    project = client.post(
        "/projects",
        json={
            "title": "Project A",
            "description": "Test Project Long Description with 20+ characters",
            "timeline": "2 months",
            "project_type": "Web"
        },
        headers=auth_headers(owner_token)
    ).json()

    opportunity = client.post(
        "/opportunities/",
        json={
            "role": "Backend",
            "project_id": project["id"],
            "seats": 1,
            "status": "open"
        },
        headers=auth_headers(owner_token)
    ).json()

    applicant = create_user()
    applicant_token = login_user(applicant["email"])

    application = client.post(
        "/applications/",
        json={
            "opportunity_id": opportunity["id"]
        },
        headers=auth_headers(applicant_token)
    ).json()

    response = client.put(
        f"/applications/{application['id']}/reject",
        headers=auth_headers(owner_token)
    )

    assert response.status_code == 200
    assert response.json()["status"] == "rejected"
def test_non_owner_cannot_accept():

    owner = create_user()
    owner_token = login_user(owner["email"])

    project = client.post(
        "/projects",
        json={
            "title": "Project A",
            "description": "Test Project Long Description with 20+ characters",
            "timeline": "2 months",
            "project_type": "Web"
        },
        headers=auth_headers(owner_token)
    ).json()

    opportunity = client.post(
        "/opportunities/",
        json={
            "role": "Frontend",
            "project_id": project["id"],
            "seats": 1,
            "status": "open"
        },
        headers=auth_headers(owner_token)
    ).json()

    applicant = create_user()
    applicant_token = login_user(applicant["email"])

    application = client.post(
        "/applications/",
        json={
            "opportunity_id": opportunity["id"]
        },
        headers=auth_headers(applicant_token)
    ).json()

    stranger = create_user()
    stranger_token = login_user(stranger["email"])

    response = client.put(
        f"/applications/{application['id']}/accept",
        headers=auth_headers(stranger_token)
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized"
def test_seat_limit():

    owner = create_user()
    owner_token = login_user(owner["email"])

    project = client.post(
        "/projects",
        json={
            "title": "Project A",
            "description": "Test Project Long Description with 20+ characters",
            "timeline": "2 months",
            "project_type": "Web"
        },
        headers=auth_headers(owner_token)
    ).json()

    opportunity = client.post(
        "/opportunities/",
        json={
            "role": "Frontend",
            "project_id": project["id"],
            "seats": 1,
            "status": "open"
        },
        headers=auth_headers(owner_token)
    ).json()

    user1 = create_user()
    token1 = login_user(user1["email"])

    user2 = create_user()
    token2 = login_user(user2["email"])

    app1 = client.post(
        "/applications/",
        json={"opportunity_id": opportunity["id"]},
        headers=auth_headers(token1)
    ).json()

    app2 = client.post(
        "/applications/",
        json={"opportunity_id": opportunity["id"]},
        headers=auth_headers(token2)
    ).json()

    first_accept = client.put(
        f"/applications/{app1['id']}/accept",
        headers=auth_headers(owner_token)
    )

    assert first_accept.status_code == 200

    second_accept = client.put(
        f"/applications/{app2['id']}/accept",
        headers=auth_headers(owner_token)
    )

    assert second_accept.status_code == 400
    assert second_accept.json()["detail"] == "No seats remaining"
def test_cannot_accept_twice():

    owner = create_user()
    owner_token = login_user(owner["email"])

    project = client.post(
        "/projects",
        json={
            "title": "Project A",
            "description": "Test Project Long Description with 20+ characters",
            "timeline": "2 months",
            "project_type": "Web"
        },
        headers=auth_headers(owner_token)
    ).json()

    opportunity = client.post(
        "/opportunities/",
        json={
            "role": "Frontend Developer",
            "project_id": project["id"],
            "seats": 2,
            "status": "open"
        },
        headers=auth_headers(owner_token)
    ).json()

    applicant = create_user()
    applicant_token = login_user(applicant["email"])

    application = client.post(
        "/applications/",
        json={
            "opportunity_id": opportunity["id"]
        },
        headers=auth_headers(applicant_token)
    ).json()

    first_accept = client.put(
        f"/applications/{application['id']}/accept",
        headers=auth_headers(owner_token)
    )

    assert first_accept.status_code == 200
    assert first_accept.json()["status"] == "accepted"

    second_accept = client.put(
        f"/applications/{application['id']}/accept",
        headers=auth_headers(owner_token)
    )

    assert second_accept.status_code == 400
    assert (
        second_accept.json()["detail"]
        == "Application already processed"
    )
def test_closed_opportunity():

    owner = create_user()
    owner_token = login_user(owner["email"])

    project = client.post(
        "/projects",
        json={
            "title": "Project A",
            "description": "Test Project Long Description with 20+ characters",
            "timeline": "2 months",
            "project_type": "Web"
        },
        headers=auth_headers(owner_token)
    ).json()

    opportunity = client.post(
        "/opportunities/",
        json={
            "role": "Frontend Developer",
            "project_id": project["id"],
            "seats": 1,
            "status": "closed"
        },
        headers=auth_headers(owner_token)
    ).json()

    applicant = create_user()
    applicant_token = login_user(applicant["email"])

    response = client.post(
        "/applications/",
        json={
            "opportunity_id": opportunity["id"]
        },
        headers=auth_headers(applicant_token)
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Opportunity is closed"
def test_apply_to_nonexistent_opportunity():

    user = create_user()
    token = login_user(user["email"])

    response = client.post(
        "/applications/",
        json={
            "opportunity_id": 999999
        },
        headers=auth_headers(token)
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Opportunity not found"
def test_accept_nonexistent_application():

    owner = create_user()
    owner_token = login_user(owner["email"])

    response = client.put(
        "/applications/999999/accept",
        headers=auth_headers(owner_token)
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Application not found"
def test_reject_nonexistent_application():

    owner = create_user()
    owner_token = login_user(owner["email"])

    response = client.put(
        "/applications/999999/reject",
        headers=auth_headers(owner_token)
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Application not found"