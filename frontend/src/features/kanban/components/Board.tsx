"use client";

import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { seedBoard } from "../data/seedBoard";
import { boardReducer, findColumnByCardId } from "../state/boardReducer";
import { BoardState, Card } from "../types";
import { Column } from "./Column";

const findColumnForDroppable = (
    board: BoardState,
    itemId: string,
): string | undefined => {
    if (board.columns[itemId]) {
        return itemId;
    }

    return findColumnByCardId(board, itemId);
};

type BoardProps = {
    initialBoard?: BoardState;
    onBoardChange?: (board: BoardState) => void;
};

export function Board({ initialBoard, onBoardChange }: BoardProps) {
    const [board, dispatch] = useReducer(boardReducer, initialBoard ?? seedBoard);
    const [activeCardId, setActiveCardId] = useState<string | null>(null);
    const isFirstChange = useRef(true);

    useEffect(() => {
        if (initialBoard) {
            dispatch({ type: "replaceBoard", payload: { board: initialBoard } });
            isFirstChange.current = true;
        }
    }, [initialBoard]);

    useEffect(() => {
        if (!onBoardChange) {
            return;
        }

        if (isFirstChange.current) {
            isFirstChange.current = false;
            return;
        }

        onBoardChange(board);
    }, [board, onBoardChange]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    const activeCard: Card | null = useMemo(() => {
        if (!activeCardId) {
            return null;
        }

        return board.cards[activeCardId] ?? null;
    }, [activeCardId, board.cards]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveCardId(null);

        if (!over || active.id === over.id) {
            return;
        }

        const activeId = String(active.id);
        const overId = String(over.id);

        const sourceColumnId = findColumnByCardId(board, activeId);
        const destinationColumnId = findColumnForDroppable(board, overId);

        if (!sourceColumnId || !destinationColumnId) {
            return;
        }

        const sourceColumn = board.columns[sourceColumnId];
        const destinationColumn = board.columns[destinationColumnId];

        const sourceIndex = sourceColumn.cardIds.indexOf(activeId);
        if (sourceIndex === -1) {
            return;
        }

        const overCardIndex = destinationColumn.cardIds.indexOf(overId);
        const destinationIndex = overCardIndex >= 0 ? overCardIndex : destinationColumn.cardIds.length;

        dispatch({
            type: "moveCard",
            payload: {
                cardId: activeId,
                sourceColumnId,
                destinationColumnId,
                destinationIndex,
            },
        });
    };

    return (
        <div className="board-shell">
            <header className="board-header">
                <p className="board-eyebrow">Kanban Board</p>
                <h1>Project Delivery</h1>
            </header>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={(event) => setActiveCardId(String(event.active.id))}
                onDragEnd={handleDragEnd}
            >
                <div className="kanban-grid">
                    {board.columnOrder.map((columnId) => {
                        const column = board.columns[columnId];
                        const cards = column.cardIds.map((cardId) => board.cards[cardId]);

                        return (
                            <Column
                                key={column.id}
                                id={column.id}
                                name={column.name}
                                cards={cards}
                                onRename={(id, name) =>
                                    dispatch({
                                        type: "renameColumn",
                                        payload: { columnId: id, name },
                                    })
                                }
                                onAddCard={(id, title, details) =>
                                    dispatch({
                                        type: "addCard",
                                        payload: { columnId: id, title, details },
                                    })
                                }
                                onDeleteCard={(cardId) =>
                                    dispatch({
                                        type: "deleteCard",
                                        payload: { cardId },
                                    })
                                }
                            />
                        );
                    })}
                </div>

                <DragOverlay>
                    {activeCard ? (
                        <article className="kanban-card is-dragging">
                            <div className="kanban-card-head">
                                <h3>{activeCard.title}</h3>
                            </div>
                            <p>{activeCard.details}</p>
                        </article>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
