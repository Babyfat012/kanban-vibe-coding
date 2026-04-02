"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card } from "../types";
import { AddCardForm } from "./AddCardForm";
import { CardItem } from "./CardItem";

type ColumnProps = {
    id: string;
    name: string;
    cards: Card[];
    onRename: (columnId: string, name: string) => void;
    onAddCard: (columnId: string, title: string, details: string) => void;
    onDeleteCard: (cardId: string) => void;
};

export function Column({
    id,
    name,
    cards,
    onRename,
    onAddCard,
    onDeleteCard,
}: ColumnProps) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <section className="kanban-column" data-testid={`column-${id}`}>
            <header className="kanban-column-header">
                <input
                    className="column-title-input"
                    value={name}
                    onChange={(event) => onRename(id, event.target.value)}
                    aria-label={`Rename ${name} column`}
                />
                <span className="column-count">{cards.length}</span>
            </header>

            <div ref={setNodeRef} className="kanban-card-list">
                <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
                    {cards.map((card) => (
                        <CardItem key={card.id} card={card} onDelete={onDeleteCard} />
                    ))}
                </SortableContext>
            </div>

            <AddCardForm columnId={id} onAddCard={onAddCard} />
        </section>
    );
}
