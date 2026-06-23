import uuid
import fnmatch
from tests.conftest import client
from tests.helpers import (
    create_user,
    login_user,
    auth_headers
)
from app.utils.redis_client import redis_client

# Setup in-memory mock store for Redis
mock_store = {}

def mock_get(key):
    return mock_store.get(key)

def mock_set(key, value, *args, **kwargs):
    mock_store[key] = str(value)
    return True

def mock_setex(key, time, value):
    mock_store[key] = str(value)
    return True

def mock_delete(*keys):
    count = 0
    for k in keys:
        if k in mock_store:
            del mock_store[k]
            count += 1
    return count

def mock_scan_iter(match=None):
    if match is None:
        return iter(mock_store.keys())
    return iter([k for k in mock_store.keys() if fnmatch.fnmatch(k, match)])

# Apply mock to redis_client
redis_client.get = mock_get
redis_client.set = mock_set
redis_client.setex = mock_setex
redis_client.delete = mock_delete
redis_client.scan_iter = mock_scan_iter


def test_pagination_endpoints():
    mock_store.clear()
    
    # 1. Setup project owner
    owner = create_user()
    owner_token = login_user(owner["email"])
    owner_headers = auth_headers(owner_token)

    # 2. Setup skill Python (unique name)
    py_name = f"Python_{uuid.uuid4()}"
    resp = client.post(
        f"/skills/?name={py_name}",
        headers=owner_headers,
    )
    skill_python = resp.json()

    # 3. Setup 5 candidates with Python skill
    candidates = []
    for _ in range(5):
        candidate = create_user()
        candidate_token = login_user(candidate["email"])
        candidate_headers = auth_headers(candidate_token)
        # Link Python to candidate
        client.post(
            "/user-skills/",
            json={"skill_id": skill_python.get("id")},
            headers=candidate_headers
        )
        candidates.append(candidate)

    # 4. Create project and link skill
    proj_resp = client.post(
        "/projects",
        json={
            "title": f"Big Data Project {uuid.uuid4()}",
            "description": "High volume data pipelines and real-time processing engine.",
            "timeline": "6 months",
            "project_type": "Data engineering"
        },
        headers=owner_headers
    )
    project = proj_resp.json()

    client.post(
        "/project-skills/",
        json={
            "project_id": project.get("id"),
            "skill_id": skill_python.get("id")
        },
        headers=owner_headers
    )

    # 5. Create opportunity under project
    opp_resp = client.post(
        "/opportunities",
        json={
            "project_id": project.get("id"),
            "role": "Data Engineer",
            "seats": 2,
            "status": "open"
        },
        headers=owner_headers
    )
    opp = opp_resp.json()

    client.post(
        "/opportunity-skills/",
        json={
            "opportunity_id": opp.get("id"),
            "skill_id": skill_python.get("id")
        },
        headers=owner_headers
    )

    # 6. Test project matching pagination
    # limit=2, offset=0
    resp = client.get(f"/matching/projects/{project.get('id')}/matches?limit=2&offset=0", headers=owner_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 2

    # limit=2, offset=2
    resp = client.get(f"/matching/projects/{project.get('id')}/matches?limit=2&offset=2", headers=owner_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 2

    # limit=2, offset=4
    resp = client.get(f"/matching/projects/{project.get('id')}/matches?limit=2&offset=4", headers=owner_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # limit=2, offset=6
    resp = client.get(f"/matching/projects/{project.get('id')}/matches?limit=2&offset=6", headers=owner_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 0

    # 7. Test opportunity matching pagination
    # limit=2, offset=0
    resp = client.get(f"/matching/opportunities/{opp.get('id')}/matches?limit=2&offset=0", headers=owner_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 2

    # 8. Test candidate ranking pagination
    # limit=3, offset=0
    resp = client.get(f"/ranking/projects/{project.get('id')}?limit=3&offset=0", headers=owner_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 3

    # 9. Test applicant ranking pagination
    # Let 3 candidates apply
    for i in range(3):
        cand_token = login_user(candidates[i]["email"])
        cand_headers = auth_headers(cand_token)
        client.post(
            "/applications",
            json={"opportunity_id": opp.get("id")},
            headers=cand_headers
        )

    # limit=2, offset=0
    resp = client.get(f"/applicant-ranking/opportunity/{opp.get('id')}?limit=2&offset=0", headers=owner_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 2


def test_cache_and_invalidation():
    mock_store.clear()

    # Set unrelated key in redis (simulating auth rate limit counters)
    redis_client.set("rate_limit:user1", "counter_value")

    # 1. Setup owner & user & skill
    owner = create_user()
    owner_token = login_user(owner["email"])
    owner_headers = auth_headers(owner_token)

    candidate = create_user()
    candidate_token = login_user(candidate["email"])
    candidate_headers = auth_headers(candidate_token)

    go_name = f"Golang_{uuid.uuid4()}"
    skill_resp = client.post(
        f"/skills/?name={go_name}",
        headers=owner_headers,
    )
    skill_go = skill_resp.json()

    proj_resp = client.post(
        "/projects",
        json={
            "title": f"Golang Backend {uuid.uuid4()}",
            "description": "API service built in Go language for fast backend queries.",
            "timeline": "2 months",
            "project_type": "Web API"
        },
        headers=owner_headers
    )
    project = proj_resp.json()

    # Link skill to project
    client.post(
        "/project-skills/",
        json={
            "project_id": project.get("id"),
            "skill_id": skill_go.get("id")
        },
        headers=owner_headers
    )

    # Link skill to user
    client.post(
        "/user-skills/",
        json={"skill_id": skill_go.get("id")},
        headers=candidate_headers
    )

    # Call project matches endpoint (this should cache the result)
    resp = client.get(f"/matching/projects/{project.get('id')}/matches", headers=owner_headers)
    assert resp.status_code == 200

    cache_key = f"buildmate:project_matches:{project.get('id')}"
    # Verify cached data exists in Redis
    assert redis_client.get(cache_key) is not None

    # Verify unrelated key is still there
    assert redis_client.get("rate_limit:user1") == "counter_value"

    # Now add another skill to project (should trigger project cache invalidation)
    rust_name = f"Rust_{uuid.uuid4()}"
    rust_skill_resp = client.post(
        f"/skills/?name={rust_name}",
        headers=owner_headers,
    )
    skill_rust = rust_skill_resp.json()

    client.post(
        "/project-skills/",
        json={
            "project_id": project.get("id"),
            "skill_id": skill_rust.get("id")
        },
        headers=owner_headers
    )

    # Verify project cache is invalidated (None)
    assert redis_client.get(cache_key) is None

    # Verify unrelated key is STILL preserved!
    assert redis_client.get("rate_limit:user1") == "counter_value"
