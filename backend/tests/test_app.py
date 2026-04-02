from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_root_serves_static_html():
    response = client.get("/")
    assert response.status_code == 200
    assert "Project Delivery" in response.text


def test_hello_endpoint():
    response = client.get("/api/hello")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello from FastAPI!"}


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
