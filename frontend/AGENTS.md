<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Frontend code overview

This frontend is a **Next.js App Router** project written in **TypeScript**. It renders a single Kanban board with client-side state (no backend yet). The UI uses **@dnd-kit** for drag-and-drop and **Vitest + Testing Library** for unit tests, plus **Playwright** for E2E coverage.

## Key entry points

- `src/app/page.tsx`: Home route that renders the board container.
- `src/app/globals.css`: Global styles and the app’s color system.

## Kanban feature structure

Located at `src/features/kanban/`:

- `components/Board.tsx`: Main board UI. Owns reducer state, drag-and-drop handlers, and renders columns/cards.
- `components/Column.tsx`: Column UI with rename input, card list, and add-card form.
- `components/CardItem.tsx`: Individual card UI with delete action and sortable behavior.
- `components/AddCardForm.tsx`: Card creation form.
- `data/seedBoard.ts`: Seeded board data (5 fixed columns + cards).
- `state/boardReducer.ts`: Pure reducer implementing rename, add, delete, and move logic.
- `types.ts`: Typed shapes for board, column, card, and reducer actions.

## State & data flow

- The board is initialized from `seedBoard` and managed by `useReducer` in `Board.tsx`.
- Drag-and-drop is powered by `@dnd-kit` with `DndContext`, `SortableContext`, and a drag overlay.
- Column renaming and card CRUD are immediate local state updates.

## Testing

- Unit tests:
	- `src/features/kanban/components/Board.test.tsx`
	- `src/features/kanban/state/boardReducer.test.ts`
- E2E tests:
	- `tests/e2e/kanban.spec.ts`

## Styling

- Global CSS uses the project’s palette (accent yellow, blue, purple, dark navy, gray).
- Layout is a 5-column responsive grid with card styling, buttons, and form inputs.

## Known constraints

- No backend integration or persistence yet.
- Authentication is not implemented.
- Only one board exists with fixed columns (renameable).
