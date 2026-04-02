from typing import Dict, List, Optional, Literal

from pydantic import BaseModel, Field


class Card(BaseModel):
    id: str
    title: str
    details: str = ""


class Column(BaseModel):
    id: str
    name: str
    cardIds: List[str]


class BoardState(BaseModel):
    columns: Dict[str, Column]
    cards: Dict[str, Card]
    columnOrder: List[str]


class BoardResponse(BaseModel):
    userId: str
    boardId: str
    board: BoardState


class BoardUpdate(BaseModel):
    board: BoardState = Field(..., description="Full board payload")


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class AiResponse(BaseModel):
    reply: str
    board: Optional[BoardState] = None


class ChatRequest(BaseModel):
    user: str = "user"
    board: BoardState
    messages: List[ChatMessage]


class ChatResponse(BaseModel):
    reply: str
    board: Optional[BoardState] = None
