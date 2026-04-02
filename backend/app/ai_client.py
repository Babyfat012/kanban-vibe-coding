import json
import os
from typing import Optional, Sequence

from openai import OpenAI
from dotenv import load_dotenv

from .schemas import AiResponse, BoardState, ChatMessage

load_dotenv()

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL_NAME = "openai/gpt-oss-120b"


def get_openrouter_client() -> OpenAI:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not set")

    return OpenAI(
        api_key=api_key,
        base_url=OPENROUTER_BASE_URL,
        default_headers={
            "HTTP-Referer": "http://localhost",
            "X-Title": "Kanban MVP",
        },
    )


def call_openrouter(prompt: str) -> str:
    client = get_openrouter_client()
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )

    content: Optional[str] = None
    if response.choices:
        content = response.choices[0].message.content

    return content or ""


def call_openrouter_structured(
    messages: Sequence[ChatMessage],
    board: BoardState,
) -> AiResponse:
    client = get_openrouter_client()
    system_prompt = (
        "You are a Kanban assistant. Reply with JSON that matches the schema. "
        "Include a 'reply' string and optionally a 'board' object when updates are needed. "
        "If no changes are required, omit 'board'."
    )

    schema = AiResponse.model_json_schema()
    payload_messages = [
        {"role": "system", "content": system_prompt},
        {
            "role": "user",
            "content": "Current board JSON:\n" + board.model_dump_json(),
        },
        *[{"role": msg.role, "content": msg.content} for msg in messages],
    ]

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=payload_messages,
        temperature=0,
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "kanban_response",
                "schema": schema,
                "strict": True,
            },
        },
    )

    content: Optional[str] = None
    if response.choices:
        content = response.choices[0].message.content

    if not content:
        raise RuntimeError("Empty response from OpenRouter")

    parsed = json.loads(content)
    return AiResponse.model_validate(parsed)
