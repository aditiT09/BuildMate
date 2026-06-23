import uuid
from tests.conftest import client
from tests.helpers import create_user, login_user, auth_headers

def test_project_resources_crud():
    # 1. Setup owner & login
    owner = create_user()
    owner_token = login_user(owner["email"])
    owner_headers = auth_headers(owner_token)

    # 2. Setup user & login (non-owner)
    user = create_user()
    user_token = login_user(user["email"])
    user_headers = auth_headers(user_token)

    # 3. Create project
    proj_resp = client.post(
        "/projects",
        json={
            "title": f"Resource Project {uuid.uuid4()}",
            "description": "A project for resources tests",
            "timeline": "3 months",
            "project_type": "Integration test"
        },
        headers=owner_headers
    )
    assert proj_resp.status_code in [200, 201]
    project = proj_resp.json()
    proj_id = project["id"]

    # 4. Create link as owner (should succeed)
    link_data = {
        "title": "Project Repository",
        "resource_type": "github",
        "url": "https://github.com/buildmate/repo"
    }
    create_resp = client.post(
        f"/projects/{proj_id}/links",
        json=link_data,
        headers=owner_headers
    )
    assert create_resp.status_code in [200, 201]
    link = create_resp.json()
    assert link["title"] == "Project Repository"
    assert link["resource_type"] == "github"
    assert link["url"] == "https://github.com/buildmate/repo"

    # 5. Create link as non-owner (should return 403)
    create_resp_fail = client.post(
        f"/projects/{proj_id}/links",
        json=link_data,
        headers=user_headers
    )
    assert create_resp_fail.status_code == 403

    # 6. List links (should succeed)
    list_resp = client.get(f"/projects/{proj_id}/links")
    assert list_resp.status_code == 200
    links = list_resp.json()
    assert len(links) == 1
    assert links[0]["title"] == "Project Repository"

    # 7. Create link with invalid URL (should return 422)
    invalid_url_data = {
        "title": "Bad Link",
        "resource_type": "trello",
        "url": "not-a-valid-url"
    }
    invalid_url_resp = client.post(
        f"/projects/{proj_id}/links",
        json=invalid_url_data,
        headers=owner_headers
    )
    assert invalid_url_resp.status_code == 422

    # 8. Create link with invalid resource type (should return 422)
    invalid_type_data = {
        "title": "Bad Type",
        "resource_type": "invalid_type",
        "url": "https://trello.com/board"
    }
    invalid_type_resp = client.post(
        f"/projects/{proj_id}/links",
        json=invalid_type_data,
        headers=owner_headers
    )
    assert invalid_type_resp.status_code == 422
