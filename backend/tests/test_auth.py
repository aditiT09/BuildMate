from tests.conftest import client
import uuid


def test_login_success():
    unique_email = f"{uuid.uuid4()}@test.com"

    user_data = {
        "name": "Test User",
        "email": unique_email,
        "password": "password123",
        "bio": "test bio"
    }

    create_response = client.post(
        "/users",
        json=user_data
    )

    assert create_response.status_code == 201

    login_response = client.post(
        "/auth/login",
        data={
            "username": unique_email,
            "password": "password123"
        }
    )

    assert login_response.status_code == 200

    data = login_response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_password():
    unique_email = f"{uuid.uuid4()}@test.com"

    user_data = {
        "name": "Test User",
        "email": unique_email,
        "password": "password123",
        "bio": "test bio"
    }

    create_response = client.post(
        "/users",
        json=user_data
    )

    assert create_response.status_code == 201

    login_response = client.post(
        "/auth/login",
        data={
            "username": unique_email,
            "password": "wrongpassword"
        }
    )

    assert login_response.status_code == 401
    assert login_response.json()["detail"] == "Invalid credentials"

def test_create_user():
    unique_email = f"{uuid.uuid4()}@test.com"

    response = client.post(
        "/users",
        json={
            "name": "Test User",
            "email": unique_email,
            "password": "password123",
            "bio": "test bio"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == unique_email
    assert data["name"] == "Test User"

def test_duplicate_email():
    unique_email = f"{uuid.uuid4()}@test.com"

    user_data = {
        "name": "Test User",
        "email": unique_email,
        "password": "password123",
        "bio": "test bio"
    }

    first_response = client.post(
        "/users",
        json=user_data
    )

    assert first_response.status_code == 201

    second_response = client.post(
        "/users",
        json=user_data
    )

    assert second_response.status_code == 400
    assert second_response.json()["detail"] == "Email already registered"