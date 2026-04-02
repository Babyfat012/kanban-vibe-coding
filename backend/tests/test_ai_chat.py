from fastapi.testclient import TestClient

from backend.app import ai_client, main
from backend.app.main import app
from backend.app.schemas import AiResponse, BoardState, Card, ChatMessage, Column

client = TestClient(app)


def sample_board() -> BoardState:
    return BoardState(
        columnOrder=["todo"],
        columns={"todo": Column(id="todo", name="To Do", cardIds=["card-1"])},
        cards={
            "card-1": Card(id="card-1", title="Ship it", details="Launch MVP")
        },
    )


def test_ai_chat_applies_optional_board_update(monkeypatch):
    board = sample_board()
    updated_board = BoardState(
        columnOrder=["todo"],
        columns={"todo": Column(id="todo", name="Backlog", cardIds=["card-1"])},
        cards=board.cards,
    )

    def fake_structured(messages, board_state):
        return AiResponse(reply="Updated column", board=updated_board)

    monkeypatch.setattr(ai_client, "call_openrouter_structured", fake_structured)
    monkeypatch.setattr(main, "call_openrouter_structured", fake_structured)

    payload = {
        "user": "user-ai",
        "board": board.model_dump(),
        "messages": [
            ChatMessage(role="user", content="Rename todo to Backlog").model_dump()
        ],
    }

    response = client.post("/api/ai/chat", json=payload)
    assert response.status_code == 200
    assert response.json()["reply"] == "Updated column"
    assert response.json()["board"]["columns"]["todo"]["name"] == "Backlog"


def test_ai_chat_allows_no_board_update(monkeypatch):
    board = sample_board()

    def fake_structured(messages, board_state):
        return AiResponse(reply="No changes", board=None)

    monkeypatch.setattr(ai_client, "call_openrouter_structured", fake_structured)
    monkeypatch.setattr(main, "call_openrouter_structured", fake_structured)

    payload = {
        "user": "user-ai-2",
        "board": board.model_dump(),
        "messages": [
            ChatMessage(role="user", content="Summarize the board").model_dump()
        ],
    }

    response = client.post("/api/ai/chat", json=payload)
    assert response.status_code == 200
    assert response.json()["reply"] == "No changes"
    assert response.json()["board"] is None
