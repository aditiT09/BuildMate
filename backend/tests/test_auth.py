from tests.conftest import client
import uuid


def test_login_success():
    unique_email = f"{uuid.uuid4()}@test.com"

    user_data = {
        "name": "Test User",
        "email": unique_email,
        "password": "Password123",
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
            "password": "Password123"
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
        "password": "Password123",
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
            "password": "Password123",
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
        "password": "Password123",
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

    assert second_response.status_code == 409
    assert second_response.json()["detail"] == "Email already registered"

def test_rate_limiter_logic(monkeypatch):
    import app.utils.rate_limiter
    from app.utils.rate_limiter import check_auth_rate_limit
    import pytest
    from fastapi import HTTPException
    import uuid

    # Mock Redis class
    class MockRedis:
        def __init__(self):
            self.data = {}
            self.ttls = {}

        def incr(self, key):
            self.data[key] = self.data.get(key, 0) + 1
            return self.data[key]

        def expire(self, key, seconds):
            self.ttls[key] = seconds
            return True

        def ttl(self, key):
            return self.ttls.get(key, -1)

        def delete(self, key):
            if key in self.data:
                del self.data[key]
            if key in self.ttls:
                del self.ttls[key]
            return 1

    mock_redis = MockRedis()
    # Monkeypatch the redis_client in the rate_limiter module
    monkeypatch.setattr(app.utils.rate_limiter, "redis_client", mock_redis)

    # Enable testing override for rate limiter
    app.utils.rate_limiter._testing_override = True

    unique_ip = f"ip-{uuid.uuid4()}"
    unique_email = f"email-{uuid.uuid4()}@test.com"

    try:
        # Send 5 attempts (should succeed / not raise 429)
        for _ in range(5):
            check_auth_rate_limit(unique_ip, unique_email)

        # The 6th attempt should raise a 429 HTTPException on email rate limit
        with pytest.raises(HTTPException) as exc_info:
            check_auth_rate_limit(unique_ip, unique_email)
        assert exc_info.value.status_code == 429
        assert "attempts for this email" in exc_info.value.detail

        # Test IP rate limiter limit (10)
        # Clear email rate limiter key to isolate IP rate limiter
        mock_redis.delete(f"rate_limit:auth:email:{unique_email.lower()}")

        # Send 4 more attempts on the IP (making a total of 10 attempts on IP)
        for _ in range(4):
            check_auth_rate_limit(unique_ip, unique_email)

        # The 11th attempt on IP should trigger IP rate limit exception
        with pytest.raises(HTTPException) as exc_info:
            check_auth_rate_limit(unique_ip, unique_email)
        assert exc_info.value.status_code == 429
        assert "attempts from this IP" in exc_info.value.detail

    finally:
        # Reset override flag
        app.utils.rate_limiter._testing_override = False