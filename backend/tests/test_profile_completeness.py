import uuid
from tests.conftest import client
from tests.helpers import create_user, login_user, auth_headers

def test_profile_completeness_calculation():
    # 1. Create a user
    user = create_user()
    token = login_user(user["email"])
    headers = auth_headers(token)

    # 2. Get baseline profile (should be 0% completeness)
    resp = client.get("/profile/me", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["completeness_percentage"] == 0

    # 3. Add 2 fields (full_name and bio) -> 2 / 7 = 29%
    resp = client.put(
        "/profile/me",
        json={
            "full_name": "John Doe",
            "bio": "Software Engineer",
            "college": None,
            "degree": None,
            "skills": None,
            "github": None,
            "linkedin": None,
            "portfolio": None,
            "avatar": None,
            "availability": None
        },
        headers=headers
    )
    assert resp.status_code == 200
    assert resp.json()["completeness_percentage"] == 29

    # 4. Add 2 more fields (college, github) -> 4 / 7 = 57%
    resp = client.put(
        "/profile/me",
        json={
            "full_name": "John Doe",
            "bio": "Software Engineer",
            "college": "MIT",
            "degree": None,
            "skills": None,
            "github": "https://github.com/johndoe",
            "linkedin": None,
            "portfolio": None,
            "avatar": None,
            "availability": None
        },
        headers=headers
    )
    assert resp.status_code == 200
    assert resp.json()["completeness_percentage"] == 57

    # 5. Complete all 7 fields -> 7 / 7 = 100%
    resp = client.put(
        "/profile/me",
        json={
            "full_name": "John Doe",
            "bio": "Software Engineer",
            "college": "MIT",
            "degree": "B.S.",
            "skills": "Python",
            "github": "https://github.com/johndoe",
            "linkedin": "https://linkedin.com/in/johndoe",
            "portfolio": "https://johndoe.com",
            "avatar": "avatar_url",
            "availability": "full_time"
        },
        headers=headers
    )
    assert resp.status_code == 200
    assert resp.json()["completeness_percentage"] == 100
