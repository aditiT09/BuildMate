import uuid
from tests.conftest import client, mock_redis_store as mock_store
from tests.helpers import (
    create_user,
    login_user,
    auth_headers
)
from app.utils.redis_client import redis_client


def test_matching_logic_and_caching():
    mock_store.clear()

    # 1. Setup owner & user & skill
    owner = create_user()
    owner_token = login_user(owner["email"])
    owner_headers = auth_headers(owner_token)

    candidate = create_user()
    candidate_token = login_user(candidate["email"])
    candidate_headers = auth_headers(candidate_token)

    py_name = f"Python_{uuid.uuid4()}"
    skill_python = client.post(
        f"/skills/?name={py_name}",
        headers=owner_headers,
    ).json()

    # Link skill to user
    client.post(
        "/user-skills/",
        json={"skill_id": skill_python["id"]},
        headers=candidate_headers
    )

    # Create project and link skill
    project = client.post(
        "/projects",
        json={
            "title": f"Big Data Project {uuid.uuid4()}",
            "description": "High volume data pipelines and real-time processing engine.",
            "timeline": "6 months",
            "project_type": "Data engineering"
        },
        headers=owner_headers
    ).json()

    client.post(
        "/project-skills/",
        json={
            "project_id": project["id"],
            "skill_id": skill_python["id"]
        },
        headers=owner_headers
    )

    cache_key = f"buildmate:project_matches:{project['id']}"

    # Verify first request -> Cache miss (key not in mock_store)
    assert cache_key not in mock_store
    resp = client.get(f"/matching/projects/{project['id']}/matches", headers=owner_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # Verify second request -> Cache hit (key now exists in mock_store)
    assert cache_key in mock_store
    resp_cached = client.get(f"/matching/projects/{project['id']}/matches", headers=owner_headers)
    assert resp_cached.status_code == 200
    assert len(resp_cached.json()) == 1

    # Verify skill change -> Cache deleted
    rust_name = f"Rust_{uuid.uuid4()}"
    skill_rust = client.post(
        f"/skills/?name={rust_name}",
        headers=owner_headers,
    ).json()

    # Add project skill (invalidates project cache)
    client.post(
        "/project-skills/",
        json={
            "project_id": project["id"],
            "skill_id": skill_rust["id"]
        },
        headers=owner_headers
    )
    assert cache_key not in mock_store

    # Verify third request -> Cache regenerated
    resp_regenerated = client.get(f"/matching/projects/{project['id']}/matches", headers=owner_headers)
    assert resp_regenerated.status_code == 200
    assert cache_key in mock_store
