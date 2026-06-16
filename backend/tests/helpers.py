import uuid

from tests.conftest import client


def create_user():
    email = f"{uuid.uuid4()}@test.com"

    response = client.post(
        "/users",
        json={
            "name": "Test User",
            "email": email,
            "bio": "test",
            "password": "Password123"
        }
    )

    return response.json()


def login_user(email, password="Password123"):
    response = client.post(
        "/auth/login",
        data={
            "username": email,
            "password": password
        }
    )

    return response.json()["access_token"]


def auth_headers(token):
    return {
        "Authorization": f"Bearer {token}"

    }