from tests.conftest import client
from tests.helpers import (
    create_user,
    login_user,
    auth_headers
)

def test_project_matching_and_skill_gap():
    # 1. Create project owner
    owner = create_user()
    owner_token = login_user(owner["email"])
    owner_headers = auth_headers(owner_token)

    # 2. Create candidate
    candidate = create_user()
    candidate_token = login_user(candidate["email"])
    candidate_headers = auth_headers(candidate_token)

    # 3. Create skills
    skill_python = client.post("/skills/?name=Python").json()
    skill_react = client.post("/skills/?name=React").json()

    # 4. Create project
    project = client.post(
        "/projects",
        json={
            "title": "Data Processing Platform",
            "description": "A high throughput data analysis engine.",
            "timeline": "3 months",
            "project_type": "Data Science"
        },
        headers=owner_headers
    ).json()

    # 5. Link Python to the project
    client.post(
        "/project-skills/",
        json={
            "project_id": project["id"],
            "skill_id": skill_python["id"]
        },
        headers=owner_headers
    )

    # 6. Link Python to the candidate
    client.post(
        "/user-skills/",
        json={
            "skill_id": skill_python["id"]
        },
        headers=candidate_headers
    )

    # 7. Test matching endpoint (should show candidate)
    matches_resp = client.get(
        f"/matching/projects/{project['id']}/matches",
        headers=owner_headers
    )
    assert matches_resp.status_code == 200
    matches = matches_resp.json()
    assert len(matches) > 0
    candidate_match = next((m for m in matches if m["user_id"] == candidate["id"]), None)
    assert candidate_match is not None
    assert candidate_match["skill_match"] == 100.0

    # 8. Test skill gap endpoint (100% match)
    gap_resp = client.get(
        f"/matching/projects/{project['id']}/users/{candidate['id']}/skill-gap",
        headers=candidate_headers
    )
    assert gap_resp.status_code == 200
    gap_data = gap_resp.json()
    assert gap_data["match_percentage"] == 100.0
    assert "Python" in gap_data["matched_skills"]
    assert len(gap_data["missing_skills"]) == 0

    # 9. Link React to the project (making candidate's match 50%)
    client.post(
        "/project-skills/",
        json={
            "project_id": project["id"],
            "skill_id": skill_react["id"]
        },
        headers=owner_headers
    )

    # 10. Test skill gap endpoint again (50% match, React missing)
    gap_resp2 = client.get(
        f"/matching/projects/{project['id']}/users/{candidate['id']}/skill-gap",
        headers=candidate_headers
    )
    assert gap_resp2.status_code == 200
    gap_data2 = gap_resp2.json()
    assert gap_data2["match_percentage"] == 50.0
    assert "Python" in gap_data2["matched_skills"]
    assert "React" in gap_data2["missing_skills"]
    assert len(gap_data2["recommendations"]) == 1
    assert gap_data2["recommendations"][0]["skill_name"] == "React"
