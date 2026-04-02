# Database approach

This document proposes the SQLite schema for the Kanban MVP. It is designed for multiple users (future-ready) while supporting a single board per user for the MVP.

## Goals

- Single board per user (enforced in application logic for now).
- Fixed columns, renameable, ordered by position.
- Cards ordered within columns by position.
- Fast reads for a user’s board and its cards.

## Tables

### `users`
- Stores login identities (future-ready).
- `username` is unique.

### `boards`
- Each board belongs to a user.
- `name` is the board title.

### `columns`
- Each column belongs to a board.
- `position` defines order.

### `cards`
- Each card belongs to a board and a column.
- `position` defines order within the column.
- `details` is optional.

## Constraints

- Cascading deletes from users → boards → columns/cards.
- Ordering is handled via `position` integers.

## Indexes

- `boards.user_id` for board lookup.
- `columns.board_id` and `columns.position` for ordered columns.
- `cards.board_id`, `cards.column_id`, and `cards.position` for ordered cards.

## Schema file

The schema is stored in `docs/kanban-schema.json`.

## Open questions

- Should we enforce a unique `(board_id, position)` constraint for columns and cards? (Could be added later.)
- Should card `details` allow markdown or remain plain text? (Currently plain text.)
