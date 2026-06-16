from tests.conftest import client
from tests.helpers import (
    create_user,
    login_user,
    auth_headers
)

def test_create_and_cancel_invitation():
    # 1. Create project owner
    owner = create_user()
    owner_token = login_user(owner["email"])

    # 2. Create project
    project = client.post(
        "/projects",
        json={
            "title": "Inv Project",
            "description": "Test Inv Description",
            "timeline": "2 months",
            "project_type": "Web"
        },
        headers=auth_headers(owner_token)
    ).json()

    # 3. Create opportunity (role)
    opportunity = client.post(
        "/opportunities/",
        json={
            "role": "Backend Developer",
            "project_id": project["id"],
            "seats": 1,
            "status": "open"
        },
        headers=auth_headers(owner_token)
    ).json()

    # 4. Create candidate user
    candidate = create_user()
    candidate_token = login_user(candidate["email"])

    # 5. Invite the candidate (owner does this)
    invite_resp = client.post(
        "/invitations/",
        json={
            "opportunity_id": opportunity["id"],
            "user_id": candidate["id"]
        },
        headers=auth_headers(owner_token)
    )
    assert invite_resp.status_code == 200
    invite_data = invite_resp.json()
    assert invite_data["status"] == "pending"

    # 6. Try to cancel invitation using candidate's token (should return 403 Forbidden)
    cancel_fail_resp = client.delete(
        f"/invitations/opportunity/{opportunity['id']}/user/{candidate['id']}",
        headers=auth_headers(candidate_token)
    )
    assert cancel_fail_resp.status_code == 403

    # 7. Cancel invitation using project owner's token (should return 200 OK)
    cancel_success_resp = client.delete(
        f"/invitations/opportunity/{opportunity['id']}/user/{candidate['id']}",
        headers=auth_headers(owner_token)
    )
    assert cancel_success_resp.status_code == 200
    assert cancel_success_resp.json()["detail"] == "Invitation cancelled successfully"

    # 8. Try to cancel again (should return 404 Not Found since it's deleted)
    cancel_again_resp = client.delete(
        f"/invitations/opportunity/{opportunity['id']}/user/{candidate['id']}",
        headers=auth_headers(owner_token)
    )
    assert cancel_again_resp.status_code == 404
