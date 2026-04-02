from fastapi.testclient import TestClient

import os

import pytest

from backend.app import ai_client, main
from backend.app.main import app

client = TestClient(app)


def test_ai_ping_returns_stubbed_answer(monkeypatch):
    monkeypatch.setattr(main, "call_openrouter", lambda prompt: "4")

    response = client.get("/api/ai/ping")
    assert response.status_code == 200
    assert response.json() == {"result": "4"}


def test_ai_ping_live_call():
    if not os.getenv("OPENROUTER_API_KEY"):
        pytest.skip("OPENROUTER_API_KEY not set")

    result = ai_client.call_openrouter("What is 2+2?")
    assert result.strip() != ""
