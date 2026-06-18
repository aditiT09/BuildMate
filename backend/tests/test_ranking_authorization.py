from tests.helpers import auth_headers
from tests.helpers import create_user
from tests.helpers import login_user

from tests.conftest import client


def _create_authenticated_user():
    user = create_user()
    token = login_user(user["email"])
    return user, auth_headers(token)


def _create_project(headers):
    response = client.post(
        "/projects",
        headers=headers,
        json={
            "title": "Authorization Test Project",
            "description": "Tests ranking access controls",
            "timeline": "1 month",
            "project_type": "test",
        },
    )
    assert response.status_code == 200
    return response.json()


def _create_opportunity(project_id, headers):
    response = client.post(
        "/opportunities/",
        headers=headers,
        json={
            "role": "Tester",
            "project_id": project_id,
            "seats": 1,
            "status": "open",
            "required_skills": [],
        },
    )
    assert response.status_code == 200
    return response.json()


def test_user_listing_requires_authentication():
    response = client.get("/users")

    assert response.status_code == 401


def test_authenticated_user_can_list_users():
    _, headers = _create_authenticated_user()

    response = client.get("/users", headers=headers)

    assert response.status_code == 200


def test_project_ranking_requires_owner():
    _, owner_headers = _create_authenticated_user()
    _, outsider_headers = _create_authenticated_user()
    project = _create_project(owner_headers)
    endpoint = f"/ranking/projects/{project['id']}"

    assert client.get(endpoint).status_code == 401
    assert client.get(endpoint, headers=outsider_headers).status_code == 403
    assert client.get(endpoint, headers=owner_headers).status_code == 200


def test_applicant_ranking_requires_project_owner():
    _, owner_headers = _create_authenticated_user()
    _, outsider_headers = _create_authenticated_user()
    project = _create_project(owner_headers)
    opportunity = _create_opportunity(project["id"], owner_headers)
    endpoint = f"/applicant-ranking/opportunity/{opportunity['id']}"

    assert client.get(endpoint).status_code == 401
    assert client.get(endpoint, headers=outsider_headers).status_code == 403
    assert client.get(endpoint, headers=owner_headers).status_code == 200
