import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_purchase_decreases_quantity():
    client = APIClient()

    # register + login
    client.post("/api/auth/register/", {"username": "sam", "email": "s@x.com", "password": "Str0ngPass!2025"}, format='json')
    login = client.post("/api/auth/login/", {"username": "sam", "password": "Str0ngPass!2025"}, format='json')
    token = login.json()['access']
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    # create sweet
    sweet = client.post("/api/sweets/", {
        "name": "Lollipop",
        "category": "Candy",
        "price": "5.00",
        "quantity": 3
    }, format='json').json()

    sweet_id = sweet['id']

    # purchase once
    resp = client.post(f"/api/sweets/{sweet_id}/purchase/")
    assert resp.status_code == 200
    assert resp.json()['quantity'] == 2

    # purchase twice more
    client.post(f"/api/sweets/{sweet_id}/purchase/")
    client.post(f"/api/sweets/{sweet_id}/purchase/")

    # now quantity should be 0
    final = client.get(f"/api/sweets/{sweet_id}/")
    assert final.json()['quantity'] == 0

@pytest.mark.django_db
def test_purchase_out_of_stock():
    client = APIClient()

    # user login
    client.post("/api/auth/register/", {"username": "sam2", "email": "s2@x.com", "password": "Str0ngPass!2025"}, format='json')
    login = client.post("/api/auth/login/", {"username": "sam2", "password": "Str0ngPass!2025"}, format='json')
    token = login.json()['access']
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    # sweet with zero quantity
    sweet = client.post("/api/sweets/", {
        "name": "Empty Candy",
        "category": "Candy",
        "price": "2.00",
        "quantity": 0
    }, format='json').json()

    sweet_id = sweet['id']

    # purchasing should fail
    resp = client.post(f"/api/sweets/{sweet_id}/purchase/")
    assert resp.status_code == 400
    assert resp.json()['detail'] == "Out of stock"
