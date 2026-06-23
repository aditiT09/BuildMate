import uuid
import pytest
from tests.conftest import client
from tests.helpers import create_user, login_user, auth_headers

def test_explanation_endpoints_and_service():
    # Setup owner & candidate & project
    owner = create_user()
    owner_token = login_user(owner["email"])
    owner_headers = auth_headers(owner_token)

    candidate = create_user()
    candidate_token = login_user(candidate["email"])
    candidate_headers = auth_headers(candidate_token)

    proj_resp = client.post(
        "/projects",
        json={
            "title": f"Explanation Project {uuid.uuid4()}",
            "description": "Test explanations with a long description string to satisfy min_length constraint.",
            "timeline": "2 months",
            "project_type": "web"
        },
        headers=owner_headers
    )
    assert proj_resp.status_code in [200, 201]
    project = proj_resp.json()

    # Get match explanation (should succeed)
    resp = client.get(f"/explanation/projects/{project['id']}/users/{candidate['id']}")
    assert resp.status_code == 200
    data = resp.json()
    assert "match_score" in data
    assert "matched_skills" in data

    # 404 for invalid project
    resp_invalid_proj = client.get(f"/explanation/projects/999999/users/{candidate['id']}")
    assert resp_invalid_proj.status_code == 404

    # 404 for invalid user
    resp_invalid_user = client.get(f"/explanation/projects/{project['id']}/users/999999")
    assert resp_invalid_user.status_code == 404


def test_skill_gap_endpoints_and_service():
    owner = create_user()
    owner_token = login_user(owner["email"])
    owner_headers = auth_headers(owner_token)

    candidate = create_user()
    candidate_token = login_user(candidate["email"])
    candidate_headers = auth_headers(candidate_token)

    proj_resp = client.post(
        "/projects",
        json={
            "title": f"Skill Gap Project {uuid.uuid4()}",
            "description": "Test skill gap with a long description string to satisfy min_length constraint.",
            "timeline": "2 months",
            "project_type": "web"
        },
        headers=owner_headers
    )
    project = proj_resp.json()

    # Get skill gap as owner (authorized)
    resp = client.get(
        f"/matching/projects/{project['id']}/users/{candidate['id']}/skill-gap",
        headers=owner_headers
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "matched_skills" in data
    assert "missing_skills" in data

    # Get skill gap as candidate themselves (authorized)
    resp_candidate = client.get(
        f"/matching/projects/{project['id']}/users/{candidate['id']}/skill-gap",
        headers=candidate_headers
    )
    assert resp_candidate.status_code == 200

    # Get skill gap as unauthorized user (should return 403)
    unauthorized_user = create_user()
    unauthorized_token = login_user(unauthorized_user["email"])
    unauthorized_headers = auth_headers(unauthorized_token)

    resp_fail = client.get(
        f"/matching/projects/{project['id']}/users/{candidate['id']}/skill-gap",
        headers=unauthorized_headers
    )
    assert resp_fail.status_code == 403

    # 404 for invalid project
    resp_invalid_proj = client.get(
        f"/matching/projects/999999/users/{candidate['id']}/skill-gap",
        headers=owner_headers
    )
    assert resp_invalid_proj.status_code == 404


def test_recommendation_endpoints():
    user = create_user()
    token = login_user(user["email"])
    headers = auth_headers(token)

    # Get recommended projects
    resp = client.get("/recommendations/projects", headers=headers)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_invitation_endpoints():
    owner = create_user()
    owner_token = login_user(owner["email"])
    owner_headers = auth_headers(owner_token)

    candidate = create_user()
    candidate_token = login_user(candidate["email"])
    candidate_headers = auth_headers(candidate_token)

    # Create project & opportunity
    proj_resp = client.post(
        "/projects",
        json={
            "title": f"Invitation Project {uuid.uuid4()}",
            "description": "Test invitations with a long description string to satisfy min_length constraint.",
            "timeline": "2 months",
            "project_type": "web"
        },
        headers=owner_headers
    )
    project = proj_resp.json()

    opp_resp = client.post(
        "/opportunities",
        json={
            "project_id": project["id"],
            "role": "Designer",
            "seats": 1,
            "status": "open"
        },
        headers=owner_headers
    )
    opportunity = opp_resp.json()

    # Create invitation
    invite_resp = client.post(
        "/invitations/",
        json={
            "opportunity_id": opportunity["id"],
            "user_id": candidate["id"]
        },
        headers=owner_headers
    )
    assert invite_resp.status_code in [200, 201]
    invitation = invite_resp.json()
    assert invitation["status"] == "pending"

    # Get sent invitations
    sent_resp = client.get("/invitations/sent", headers=owner_headers)
    assert sent_resp.status_code == 200
    sent = sent_resp.json()
    assert len(sent) >= 1

    # Get received invitations
    received_resp = client.get("/invitations/received", headers=candidate_headers)
    assert received_resp.status_code == 200
    received = received_resp.json()
    assert len(received) >= 1

    # Respond to invitation (accept)
    respond_resp = client.put(
        f"/invitations/{invitation['id']}/respond",
        json={"status": "accepted"},
        headers=candidate_headers
    )
    assert respond_resp.status_code == 200
    assert respond_resp.json()["status"] == "accepted"

    # Try to respond again (should fail with 400)
    respond_again = client.put(
        f"/invitations/{invitation['id']}/respond",
        json={"status": "rejected"},
        headers=candidate_headers
    )
    assert respond_again.status_code == 400

    # 404 for invalid invitation
    respond_invalid = client.put(
        "/invitations/999999/respond",
        json={"status": "accepted"},
        headers=candidate_headers
    )
    assert respond_invalid.status_code == 404
