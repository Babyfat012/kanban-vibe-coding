from __future__ import annotations

import sqlite3
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, List, Tuple
from uuid import uuid4

from .schemas import BoardState, Card, Column

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "kanban.db"


@dataclass
class UserBoard:
    user_id: str
    board_id: str


SEED_BOARD = BoardState(
    columnOrder=["todo", "in-progress", "review", "blocked", "done"],
    columns={
        "todo": Column(id="todo", name="To Do", cardIds=["card-1", "card-2"]),
        "in-progress": Column(id="in-progress", name="In Progress", cardIds=["card-3"]),
        "review": Column(id="review", name="Review", cardIds=["card-4"]),
        "blocked": Column(id="blocked", name="Blocked", cardIds=["card-5"]),
        "done": Column(id="done", name="Done", cardIds=["card-6"]),
    },
    cards={
        "card-1": Card(
            id="card-1",
            title="Define launch scope",
            details="Lock MVP requirements with product and design.",
        ),
        "card-2": Card(
            id="card-2",
            title="Create wireframes",
            details="Draft board, column, and card layouts.",
        ),
        "card-3": Card(
            id="card-3",
            title="Build Kanban UI",
            details="Implement board shell and seeded data flow.",
        ),
        "card-4": Card(
            id="card-4",
            title="Review accessibility",
            details="Check keyboard focus and color contrast.",
        ),
        "card-5": Card(
            id="card-5",
            title="Resolve flaky test",
            details="Stabilize drag and drop integration flow.",
        ),
        "card-6": Card(
            id="card-6",
            title="Prepare demo",
            details="Record walkthrough for stakeholder review.",
        ),
    },
)


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with get_connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS boards (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS columns (
                id TEXT PRIMARY KEY,
                board_id TEXT NOT NULL,
                name TEXT NOT NULL,
                position INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS cards (
                id TEXT PRIMARY KEY,
                board_id TEXT NOT NULL,
                column_id TEXT NOT NULL,
                title TEXT NOT NULL,
                details TEXT,
                position INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
                FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
            );
            """
        )


def _now() -> str:
    return datetime.utcnow().isoformat()


def _column_db_id(board_id: str, column_id: str) -> str:
    return f"{board_id}:column:{column_id}"


def _card_db_id(board_id: str, card_id: str) -> str:
    return f"{board_id}:card:{card_id}"


def _strip_prefix(value: str) -> str:
    return value.split(":", 2)[-1]


def ensure_user_board(username: str) -> UserBoard:
    init_db()
    with get_connection() as conn:
        user = conn.execute(
            "SELECT id FROM users WHERE username = ?", (username,)
        ).fetchone()
        if user is None:
            user_id = str(uuid4())
            conn.execute(
                "INSERT INTO users (id, username, created_at) VALUES (?, ?, ?)",
                (user_id, username, _now()),
            )
        else:
            user_id = user["id"]

        board = conn.execute(
            "SELECT id FROM boards WHERE user_id = ?", (user_id,)
        ).fetchone()
        if board is None:
            board_id = str(uuid4())
            conn.execute(
                "INSERT INTO boards (id, user_id, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                (board_id, user_id, "Project Delivery", _now(), _now()),
            )
            _seed_board(conn, board_id)
        else:
            board_id = board["id"]

    return UserBoard(user_id=user_id, board_id=board_id)


def _seed_board(conn: sqlite3.Connection, board_id: str) -> None:
    columns = SEED_BOARD.columns
    cards = SEED_BOARD.cards

    for position, column_id in enumerate(SEED_BOARD.columnOrder):
        column = columns[column_id]
        db_column_id = _column_db_id(board_id, column.id)
        conn.execute(
            "INSERT INTO columns (id, board_id, name, position, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
            (db_column_id, board_id, column.name, position, _now(), _now()),
        )

        for card_position, card_id in enumerate(column.cardIds):
            card = cards[card_id]
            db_card_id = _card_db_id(board_id, card.id)
            conn.execute(
                "INSERT INTO cards (id, board_id, column_id, title, details, position, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    db_card_id,
                    board_id,
                    db_column_id,
                    card.title,
                    card.details,
                    card_position,
                    _now(),
                    _now(),
                ),
            )


def fetch_board(board_id: str) -> BoardState:
    with get_connection() as conn:
        columns_rows = conn.execute(
            "SELECT id, name, position FROM columns WHERE board_id = ? ORDER BY position",
            (board_id,),
        ).fetchall()
        cards_rows = conn.execute(
            "SELECT id, column_id, title, details, position FROM cards WHERE board_id = ? ORDER BY position",
            (board_id,),
        ).fetchall()

    columns: Dict[str, Column] = {}
    column_order: List[str] = []
    for row in columns_rows:
        column_id = _strip_prefix(row["id"])
        columns[column_id] = Column(id=column_id, name=row["name"], cardIds=[])
        column_order.append(column_id)

    cards: Dict[str, Card] = {}
    for row in cards_rows:
        card_id = _strip_prefix(row["id"])
        card = Card(id=card_id, title=row["title"], details=row["details"] or "")
        cards[card.id] = card
        column = columns.get(_strip_prefix(row["column_id"]))
        if column is not None:
            column.cardIds.append(card.id)

    return BoardState(columns=columns, cards=cards, columnOrder=column_order)


def replace_board(board_id: str, board: BoardState) -> None:
    with get_connection() as conn:
        conn.execute("DELETE FROM cards WHERE board_id = ?", (board_id,))
        conn.execute("DELETE FROM columns WHERE board_id = ?", (board_id,))

        for position, column_id in enumerate(board.columnOrder):
            column = board.columns[column_id]
            db_column_id = _column_db_id(board_id, column.id)
            conn.execute(
                "INSERT INTO columns (id, board_id, name, position, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
                (db_column_id, board_id, column.name, position, _now(), _now()),
            )

            for card_position, card_id in enumerate(column.cardIds):
                card = board.cards[card_id]
                db_card_id = _card_db_id(board_id, card.id)
                conn.execute(
                    "INSERT INTO cards (id, board_id, column_id, title, details, position, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    (
                        db_card_id,
                        board_id,
                        db_column_id,
                        card.title,
                        card.details,
                        card_position,
                        _now(),
                        _now(),
                    ),
                )

        conn.execute(
            "UPDATE boards SET updated_at = ? WHERE id = ?", (_now(), board_id)
        )
