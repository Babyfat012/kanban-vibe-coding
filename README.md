# Kanban MVP

This repository contains a Next.js Kanban frontend and a FastAPI backend. The backend serves the static frontend export at `/` and exposes API routes under `/api`.

## Quick start (Docker)

Use the scripts in `scripts/` for your platform:

- Windows: `scripts/start.ps1`
- Mac/Linux: `scripts/start.sh`

Stop with the matching `stop` script.

## Local backend (optional)

The backend expects a static export in `backend/static`. The Docker build generates it automatically from `frontend/`.

## Tests

Backend unit tests (pytest) live in `backend/tests`.
Frontend unit tests (Vitest) are in `frontend/src`, and Playwright tests are in `frontend/tests/e2e`.
