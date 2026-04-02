from uuid import uuid4

from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_get_board_returns_seeded_data():
    user = f"user-{uuid4()}"
    response = client.get("/api/board", params={"user": user})
    assert response.status_code == 200
    payload = response.json()
    assert payload["board"]["columnOrder"] == [
        "todo",
        "in-progress",
        "review",
        "blocked",
        "done",
    ]
    assert "card-1" in payload["board"]["cards"]


def test_put_board_updates_state():
    user = f"user-{uuid4()}"
    payload = client.get("/api/board", params={"user": user}).json()
    board = payload["board"]

    board["columns"]["todo"]["name"] = "Backlog"
    board["cards"]["card-1"]["title"] = "Updated title"
    board["columns"]["done"]["cardIds"].remove("card-6")
    board["columns"]["todo"]["cardIds"].append("card-6")

    update_response = client.put(
        "/api/board",
        params={"user": user},
        json={"board": board},
    )

    assert update_response.status_code == 200

    refreshed = client.get("/api/board", params={"user": user}).json()["board"]
    assert refreshed["columns"]["todo"]["name"] == "Backlog"
    assert refreshed["cards"]["card-1"]["title"] == "Updated title"
    assert "card-6" in refreshed["columns"]["todo"]["cardIds"]
