from tests.conftest import client
from tests.helpers import (
    create_user,
    login_user,
    auth_headers
)

def test_profile_crud():
    user = create_user()
    token = login_user(user["email"])
    headers = auth_headers(token)

    # 1. Update Profile (PUT /profile/me)
    resp = client.put(
        "/profile/me",
        json={
            "full_name": "Test User Completeness",
            "bio": "I am a developer at BuildMate",
            "college": "My University",
            "degree": "B.S. Computer Science",
            "skills": "Python, SQL, React",
            "github": "https://github.com/test",
            "linkedin": "https://linkedin.com/in/test",
            "portfolio": "https://test.github.io",
            "avatar": "avatar_url",
            "availability": "full_time"
        },
        headers=headers
    )
    assert resp.status_code == 200
    profile = resp.json()
    assert profile["full_name"] == "Test User Completeness"
    assert profile["college"] == "My University"

    # 2. Get Profile (GET /profile/me)
    get_resp = client.get("/profile/me", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["bio"] == "I am a developer at BuildMate"
