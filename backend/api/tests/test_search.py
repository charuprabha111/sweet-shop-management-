import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_search_by_name_and_category_and_price_range():
    client = APIClient()

    # register & login
    client.post("/api/auth/register/", {"username":"s1","email":"s1@x.com","password":"Str0ngPass!2025"}, format='json')
    login = client.post("/api/auth/login/", {"username":"s1","password":"Str0ngPass!2025"}, format='json')
    token = login.json()['access']
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    # create sweets
    client.post("/api/sweets/", {"name":"Choco Delight","category":"Chocolate","price":"50.00","quantity":10}, format='json')
    client.post("/api/sweets/", {"name":"Choco Mini","category":"Chocolate","price":"20.00","quantity":5}, format='json')
    client.post("/api/sweets/", {"name":"Sour Candy","category":"Candy","price":"10.00","quantity":8}, format='json')
    client.post("/api/sweets/", {"name":"Luxury Bar","category":"Chocolate","price":"150.00","quantity":2}, format='json')

    # 1) search by name substring
    r = client.get("/api/sweets/?name=Choco")
    assert r.status_code == 200
    items = r.json()
    if isinstance(items, dict) and 'results' in items:
        items = items['results']
    names = [i['name'] for i in items]
    assert "Choco Delight" in names and "Choco Mini" in names

    # 2) filter by category
    r2 = client.get("/api/sweets/?category=Candy")
    items2 = r2.json()
    if isinstance(items2, dict) and 'results' in items2:
        items2 = items2['results']
    assert any(i['name']=="Sour Candy" for i in items2)
    assert not any(i['category']!="Candy" for i in items2)

    # 3) filter by price range (min_price, max_price)
    r3 = client.get("/api/sweets/?min_price=30&max_price=100")
    items3 = r3.json()
    if isinstance(items3, dict) and 'results' in items3:
        items3 = items3['results']
    # should include Choco Delight (50) but not Choco Mini (20) or Luxury Bar(150)
    assert any(i['name']=="Choco Delight" for i in items3)
    assert not any(i['name']=="Choco Mini" for i in items3)
    assert not any(i['name']=="Luxury Bar" for i in items3)
