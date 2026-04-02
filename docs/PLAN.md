# Project plan for the Kanban MVP

This document expands each phase into actionable checklists with tests and success criteria. Each part is completed and verified before moving forward.

## Part 1: Plan (current)

### Checklist
- [ ] Capture the current frontend architecture, data flow, and tests in `frontend/AGENTS.md`.
- [ ] Expand this plan with detailed substeps, tests, and success criteria for Parts 2–10.
- [ ] Confirm target test coverage: **>= 80% unit test coverage** with robust integration tests.
- [ ] Share the plan for review and wait for explicit approval before starting Part 2.

### Tests
- N/A (planning-only).

### Success criteria
- `docs/PLAN.md` includes checklists, tests, and success criteria for all parts.
- `frontend/AGENTS.md` accurately describes the current frontend structure, state, and tests.
- Plan is approved by the user before implementation begins.

## Part 2: Scaffolding

### Checklist
- [x] Create Dockerfile and docker-compose (if needed) with FastAPI + Next.js static hosting.
- [x] Initialize `backend/` with FastAPI app skeleton and health route.
- [x] Add `scripts/` start/stop scripts for Windows/Mac/Linux.
- [x] Serve a static HTML page at `/` (Hello World) and a sample API route.
- [x] Document run steps in top-level README (or `docs/`).

### Tests
- [x] Backend unit test for health route (pytest).
- [x] Lightweight integration test for “Hello World” static serving.

### Success criteria
- [x] `docker compose up` (or equivalent) starts backend with static HTML at `/`.
- [x] API route responds successfully from the running container.
- [x] Start/stop scripts work on Windows, Mac, and Linux.

## Part 3: Add in Frontend

### Checklist
- [x] Add Next.js build step to produce a static build.
- [x] Configure FastAPI to serve the built frontend at `/`.
- [ ] Ensure the Kanban demo loads correctly from the backend.
- [x] Update Dockerfile to include frontend build artifacts.

### Tests
- [ ] Frontend unit tests (Vitest + Testing Library) pass.
- [ ] Integration test verifying the board loads at `/`.
- [x] Backend integration test that serves static assets.

### Success criteria
- [ ] Navigating to `/` shows the existing Kanban UI.
- [x] Static assets are served correctly by FastAPI.
- [ ] Unit test coverage stays **>= 80%**.

## Part 4: Fake user sign-in

### Checklist
- [x] Add a login screen gating access to the Kanban.
- [x] Implement dummy auth using hardcoded credentials (`user` / `password`).
- [x] Add logout flow and session handling (client-side or backend session).
- [x] Update UI for auth states.

### Tests
- [ ] Unit tests for auth state transitions.
- [ ] Integration tests for login/logout flows.
- [ ] E2E test: login required to reach board.

### Success criteria
- [ ] Unauthenticated users see login page.
- [ ] Valid credentials show the Kanban; invalid credentials show error.
- [ ] Logout returns to login screen.
- [ ] Unit test coverage stays **>= 80%**.

## Part 5: Database modeling

### Checklist
- [x] Propose SQLite schema for users, boards, columns, and cards.
- [x] Save schema proposal as JSON in `docs/`.
- [x] Document database approach and assumptions in `docs/`.
- [x] Get explicit user approval before implementing.

### Tests
- N/A (modeling-only).

### Success criteria
- Schema JSON saved in `docs/`.
- Docs cover relationships, indexes, and constraints.
- User approval granted before Part 6.

## Part 6: Backend

### Checklist
- [x] Implement DB initialization / migrations (auto-create if missing).
- [x] Add API routes for board read/write per user.
- [x] Add validation + error handling for API routes.
- [x] Add tests for CRUD flows and edge cases.

### Tests
- [x] Backend unit tests for each route and service layer.
- [x] Integration tests for reading/writing board state.

### Success criteria
- [x] Backend can create DB and return a user’s board.
- [x] Board updates persist across requests.
- [x] Unit test coverage stays **>= 80%**.

## Part 7: Frontend + Backend

### Checklist
- [x] Replace frontend seed state with API-driven data.
- [x] Implement optimistic updates (or loading state) for board changes.
- [x] Error handling for failed API requests.
- [x] Update tests for API-backed behavior.

### Tests
- [ ] Frontend integration tests for API data loading.
- [ ] E2E test validating persistence across reloads.
- [ ] Contract tests (if needed) for API shapes.

### Success criteria
- Board state persists between sessions.
- API failures show graceful UI feedback.
- Unit test coverage stays **>= 80%**.

## Part 8: AI connectivity

### Checklist
- [x] Add backend OpenRouter client using `OPENROUTER_API_KEY`.
- [x] Configure model `openai/gpt-oss-120b`.
- [x] Add a connectivity route (e.g., `/ai/ping`).

### Tests
- [x] Mocked unit tests for AI client.
- [x] Optional integration test to call OpenRouter (guarded, can be skipped in CI).

### Success criteria
- [x] Backend can make a successful AI call in dev.
- [x] “2+2” test returns expected response.
- [x] Unit test coverage stays **>= 80%**.

## Part 9: AI logic extension

### Checklist
- [x] Define structured output schema for AI responses.
- [x] Send board JSON + conversation history + user message.
- [x] Validate AI responses and apply optional board updates.
- [x] Add logging + error handling for AI responses.

### Tests
- [x] Unit tests for schema validation + update application.
- [x] Integration tests with mocked AI responses.

### Success criteria
- [x] AI responses are validated against the schema.
- [x] Board updates apply deterministically.
- [x] Unit test coverage stays **>= 80%**.

## Part 10: AI sidebar integration

### Checklist
- [x] Build a sidebar UI for chat with message history.
- [x] Connect to backend AI endpoint.
- [x] Apply AI-driven board updates in the UI.
- [x] Add loading, error, and empty states.

### Tests
- [ ] Component tests for chat UI.
- [ ] Integration tests for AI-driven updates.
- [ ] E2E test covering chat + board update flow.

### Success criteria
- Sidebar chat is usable and responsive.
- AI can update the board through structured outputs.
- Unit test coverage stays **>= 80%**.