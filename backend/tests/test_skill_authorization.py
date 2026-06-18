from tests.conftest import client
from tests.helpers import auth_headers
from tests.helpers import create_user
from tests.helpers import login_user


def test_skill_creation_requires_authentication():
    response = client.post("/skills/?name=Anonymous Skill")

    assert response.status_code == 401


def test_authenticated_user_can_create_skill():
    user = create_user()
    token = login_user(user["email"])

    response = client.post(
        "/skills/?name=Authenticated Skill",
        headers=auth_headers(token),
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Authenticated Skill"
