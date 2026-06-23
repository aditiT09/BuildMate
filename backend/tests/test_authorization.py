from tests.conftest import client
from tests.helpers import (
    create_user,
    login_user,
    auth_headers
)

def test_project_ownership_authorization():
    # 1. Create Owner and a Project
    owner = create_user()
    owner_token = login_user(owner["email"])
    owner_headers = auth_headers(owner_token)

    project = client.post(
        "/projects",
        json={
            "title": "Owner's Special Project",
            "description": "This is a very special project with a long description.",
            "timeline": "3 months",
            "project_type": "Data Science"
        },
        headers=owner_headers
    ).json()

    # 2. Create Stranger
    stranger = create_user()
    stranger_token = login_user(stranger["email"])
    stranger_headers = auth_headers(stranger_token)

    # 3. Verify stranger cannot modify owner's project (PUT -> 403)
    put_resp = client.put(
        f"/projects/{project['id']}",
        json={
            "title": "Hacked Project Title",
            "description": "This description is also long and detailed.",
            "timeline": "1 month",
            "project_type": "Web Development"
        },
        headers=stranger_headers
    )
    assert put_resp.status_code == 403

    # 4. Verify stranger cannot delete owner's project (DELETE -> 403)
    del_resp = client.delete(
        f"/projects/{project['id']}",
        headers=stranger_headers
    )
    assert del_resp.status_code == 403

    # 5. Verify stranger cannot view matches for owner's project (GET -> 403)
    match_resp = client.get(
        f"/matching/projects/{project['id']}/matches",
        headers=stranger_headers
    )
    assert match_resp.status_code == 403

    # 6. Verify stranger cannot view rankings for owner's project (GET -> 403)
    rank_resp = client.get(
        f"/ranking/projects/{project['id']}",
        headers=stranger_headers
    )
    assert rank_resp.status_code == 403


def test_opportunity_ownership_authorization():
    owner = create_user()
    owner_token = login_user(owner["email"])
    owner_headers = auth_headers(owner_token)

    project = client.post(
        "/projects",
        json={
            "title": "Owner's Special Project 2",
            "description": "This is another very special project with a long description.",
            "timeline": "3 months",
            "project_type": "Data Science"
        },
        headers=owner_headers
    ).json()

    opp = client.post(
        "/opportunities",
        json={
            "project_id": project["id"],
            "role": "Data Scientist",
            "seats": 1,
            "status": "open"
        },
        headers=owner_headers
    ).json()

    stranger = create_user()
    stranger_token = login_user(stranger["email"])
    stranger_headers = auth_headers(stranger_token)

    # Verify stranger cannot view opportunity matches (GET -> 403)
    match_resp = client.get(
        f"/matching/opportunities/{opp['id']}/matches",
        headers=stranger_headers
    )
    assert match_resp.status_code == 403

    # Verify stranger cannot view applicant rankings (GET -> 403)
    app_rank_resp = client.get(
        f"/applicant-ranking/opportunity/{opp['id']}",
        headers=stranger_headers
    )
    assert app_rank_resp.status_code == 403


def test_project_skills_authorization():
    owner = create_user()
    owner_token = login_user(owner["email"])
    owner_headers = auth_headers(owner_token)

    project = client.post(
        "/projects",
        json={
            "title": "Owner's Special Project 3",
            "description": "Yet another very special project with a long description.",
            "timeline": "3 months",
            "project_type": "Data Science"
        },
        headers=owner_headers
    ).json()

    skill = client.post(
        "/skills/?name=PySpark",
        headers=owner_headers
    ).json()

    stranger = create_user()
    stranger_token = login_user(stranger["email"])
    stranger_headers = auth_headers(stranger_token)

    # Verify stranger cannot add skill to owner's project (POST -> 403)
    skill_resp = client.post(
        "/project-skills/",
        json={
            "project_id": project["id"],
            "skill_id": skill["id"]
        },
        headers=stranger_headers
    )
    assert skill_resp.status_code == 403
