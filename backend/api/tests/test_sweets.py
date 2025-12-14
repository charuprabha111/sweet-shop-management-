import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_add_sweet_requires_auth():
    client = APIClient()
    payload = {"name":"Choco Bar", "category":"Candy", "price":"10.50", "quantity": 5}
    resp = client.post("/api/sweets/", payload, format='json')
    assert resp.status_code in (401, 403), f"Expected 401/403 for unauthenticated, got {resp.status_code}: {resp.content}"

@pytest.mark.django_db
def test_create_and_list_sweet():
    client = APIClient()
    # register & login
    client.post("/api/auth/register/", {"username":"owner","email":"o@x.com","password":"Str0ngPass!2025"}, format='json')
    login = client.post("/api/auth/login/", {"username":"owner","password":"Str0ngPass!2025"}, format='json')
    assert login.status_code == 200
    token = login.json()['access']
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    # create sweet
    payload = {"name":"Choco Bar", "category":"Candy", "price":"10.50", "quantity": 5}
    create = client.post("/api/sweets/", payload, format='json')
    assert create.status_code == 201, f"Create failed: {create.status_code} {create.content}"
    body = create.json()
    assert body['name'] == "Choco Bar"
    assert body['quantity'] == 5

    # list sweets and check presence
    list_resp = client.get("/api/sweets/")
    assert list_resp.status_code == 200
    items = list_resp.json()
    # if using DjangoRestFramework default pagination, items may be under 'results'
    if isinstance(items, dict) and 'results' in items:
        results = items['results']
    else:
        results = items
    assert any(i['name'] == "Choco Bar" for i in results), f"Sweet not found in list: {results}"
