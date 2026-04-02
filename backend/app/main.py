from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from .ai_client import call_openrouter, call_openrouter_structured
from .db import ensure_user_board, fetch_board, init_db, replace_board
from .schemas import BoardResponse, BoardUpdate, ChatRequest, ChatResponse

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(title="Kanban MVP API", version="0.1.0")


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/")
def root():
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return JSONResponse({"message": "Hello from FastAPI"})


@app.get("/api/hello")
def hello():
    return {"message": "Hello from FastAPI!"}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/ai/ping")
def ai_ping():
    result = call_openrouter("What is 2+2?")
    return {"result": result.strip()}


@app.post("/api/ai/chat", response_model=ChatResponse)
def ai_chat(payload: ChatRequest):
    user_board = ensure_user_board(payload.user)
    ai_response = call_openrouter_structured(payload.messages, payload.board)

    if ai_response.board:
        replace_board(user_board.board_id, ai_response.board)

    return ChatResponse(reply=ai_response.reply, board=ai_response.board)


@app.get("/api/board", response_model=BoardResponse)
def get_board(user: str = "user"):
    user_board = ensure_user_board(user)
    board = fetch_board(user_board.board_id)
    return BoardResponse(userId=user_board.user_id, boardId=user_board.board_id, board=board)


@app.put("/api/board", response_model=BoardResponse)
def update_board(payload: BoardUpdate, user: str = "user"):
    user_board = ensure_user_board(user)
    replace_board(user_board.board_id, payload.board)
    board = fetch_board(user_board.board_id)
    return BoardResponse(userId=user_board.user_id, boardId=user_board.board_id, board=board)


@app.get("/{path:path}")
def static_assets(path: str):
    if path.startswith("api/"):
        raise HTTPException(status_code=404, detail="Not found")

    file_path = STATIC_DIR / path
    if file_path.exists() and file_path.is_file():
        return FileResponse(file_path)

    raise HTTPException(status_code=404, detail="Not found")


if (STATIC_DIR / "_next").exists():
    app.mount("/_next", StaticFiles(directory=STATIC_DIR / "_next"), name="next")
