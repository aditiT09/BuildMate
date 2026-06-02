# tests/test_auth.py
from tests.conftest import client


def test_register_user():
    
        response = client.post(
           "/users",
        json={
            "name": "testuser",
            "email": "test@example.com",
            "password": "password123"
        }
    )

    assert response.status_code in [200, 201]