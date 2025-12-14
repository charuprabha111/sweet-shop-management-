import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_restock_requires_admin():
    client = APIClient()

    # normal user
    client.post("/api/auth/register/", {
        "username": "u1",
        "email": "u1@x.com",
        "password": "Str0ngPass!2025"
    }, format='json')

    login = client.post("/api/auth/login/", {
        "username": "u1",
        "password": "Str0ngPass!2025"
    }, format='json')
    
    token = login.json()['access']
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    # create sweet
    sweet = client.post("/api/sweets/", {
        "name": "Milk Candy",
        "category": "Candy",
        "price": "5.00",
        "quantity": 10
    }, format='json').json()

    sweet_id = sweet['id']

    # non-admin user tries to restock → should FAIL
    resp = client.post(f"/api/sweets/{sweet_id}/restock/", {"amount": 5}, format='json')
    assert resp.status_code == 403


@pytest.mark.django_db
def test_admin_can_restock():
    client = APIClient()

    # create admin user
    client.post("/api/auth/register/", {
        "username": "admin",
        "email": "admin@x.com",
        "password": "Str0ngPass!2025"
    }, format='json')

    # make admin superuser manually
    from django.contrib.auth.models import User
    admin_user = User.objects.get(username="admin")
    admin_user.is_staff = True
    admin_user.save()

    # login admin
    login = client.post("/api/auth/login/", {
        "username": "admin",
        "password": "Str0ngPass!2025"
    }, format='json')
    
    token = login.json()['access']
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    # create sweet
    sweet = client.post("/api/sweets/", {
        "name": "Mint Candy",
        "category": "Candy",
        "price": "2.00",
        "quantity": 3
    }, format='json').json()

    sweet_id = sweet['id']

    # restock 7 more
    resp = client.post(f"/api/sweets/{sweet_id}/restock/", {"amount": 7}, format='json')
    assert resp.status_code == 200, resp.content
    assert resp.json()['quantity'] == 10
