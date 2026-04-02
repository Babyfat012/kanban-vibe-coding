import { BoardAction, BoardState, Card } from "../types";

const createCardId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }

    return `card-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const reorder = <T,>(items: T[], fromIndex: number, toIndex: number): T[] => {
    const nextItems = [...items];
    const [removed] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, removed);
    return nextItems;
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

export const findColumnByCardId = (
    board: BoardState,
    cardId: string,
): string | undefined => {
    return board.columnOrder.find((columnId) =>
        board.columns[columnId].cardIds.includes(cardId),
    );
};

export const boardReducer = (
    state: BoardState,
    action: BoardAction,
): BoardState => {
    switch (action.type) {
        case "replaceBoard": {
            return action.payload.board;
        }
        case "renameColumn": {
            const { columnId, name } = action.payload;
            const column = state.columns[columnId];
            if (!column) {
                return state;
            }

            const trimmedName = name.trim();
            if (!trimmedName) {
                return state;
            }

            return {
                ...state,
                columns: {
                    ...state.columns,
                    [columnId]: {
                        ...column,
                        name: trimmedName,
                    },
                },
            };
        }

        case "addCard": {
            const { columnId, title, details } = action.payload;
            const column = state.columns[columnId];
            if (!column) {
                return state;
            }

            const trimmedTitle = title.trim();
            if (!trimmedTitle) {
                return state;
            }

            const cardId = createCardId();
            const card: Card = {
                id: cardId,
                title: trimmedTitle,
                details: details.trim(),
            };

            return {
                ...state,
                cards: {
                    ...state.cards,
                    [cardId]: card,
                },
                columns: {
                    ...state.columns,
                    [columnId]: {
                        ...column,
                        cardIds: [...column.cardIds, cardId],
                    },
                },
            };
        }

        case "deleteCard": {
            const { cardId } = action.payload;
            if (!state.cards[cardId]) {
                return state;
            }

            const nextCards = { ...state.cards };
            delete nextCards[cardId];

            const nextColumns = Object.fromEntries(
                Object.entries(state.columns).map(([columnId, column]) => [
                    columnId,
                    {
                        ...column,
                        cardIds: column.cardIds.filter((id) => id !== cardId),
                    },
                ]),
            );

            return {
                ...state,
                cards: nextCards,
                columns: nextColumns,
            };
        }

        case "moveCard": {
            const {
                cardId,
                sourceColumnId,
                destinationColumnId,
                destinationIndex,
            } = action.payload;

            const sourceColumn = state.columns[sourceColumnId];
            const destinationColumn = state.columns[destinationColumnId];

            if (!sourceColumn || !destinationColumn) {
                return state;
            }

            const sourceIndex = sourceColumn.cardIds.indexOf(cardId);
            if (sourceIndex === -1) {
                return state;
            }

            if (sourceColumnId === destinationColumnId) {
                const nextIndex = clamp(destinationIndex, 0, sourceColumn.cardIds.length - 1);

                if (sourceIndex === nextIndex) {
                    return state;
                }

                return {
                    ...state,
                    columns: {
                        ...state.columns,
                        [sourceColumnId]: {
                            ...sourceColumn,
                            cardIds: reorder(sourceColumn.cardIds, sourceIndex, nextIndex),
                        },
                    },
                };
            }

            const sourceCardIds = sourceColumn.cardIds.filter((id) => id !== cardId);
            const nextDestinationIndex = clamp(
                destinationIndex,
                0,
                destinationColumn.cardIds.length,
            );
            const destinationCardIds = [...destinationColumn.cardIds];
            destinationCardIds.splice(nextDestinationIndex, 0, cardId);

            return {
                ...state,
                columns: {
                    ...state.columns,
                    [sourceColumnId]: {
                        ...sourceColumn,
                        cardIds: sourceCardIds,
                    },
                    [destinationColumnId]: {
                        ...destinationColumn,
                        cardIds: destinationCardIds,
                    },
                },
            };
        }

        default:
            return state;
    }
};
