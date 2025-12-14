import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_register_returns_token():
    client = APIClient()
    url = "/api/auth/register/"
    data = {
        "username": "alice",
        "email": "alice@example.com",
        "password": "Str0ngPass!2025"
    }
    resp = client.post(url, data, format='json')
    assert resp.status_code == 201, f"Expected 201, got {resp.status_code}: {resp.content}"
    assert "access" in resp.json(), f"No access token in response: {resp.json()}"

@pytest.mark.django_db
def test_login_returns_tokens():
    client = APIClient()

    # Register first
    reg = client.post("/api/auth/register/", {
        "username": "bob", "email": "bob@example.com", "password": "Str0ngPass!2025"
    }, format='json')
    assert reg.status_code == 201, f"Register failed: {reg.status_code} {reg.content}"

    # Now login
    login = client.post("/api/auth/login/", {
        "username": "bob", "password": "Str0ngPass!2025"
    }, format='json')

    assert login.status_code == 200
    body = login.json()
    assert "access" in body and "refresh" in body

