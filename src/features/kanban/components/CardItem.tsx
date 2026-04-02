"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Card } from "../types";

type CardItemProps = {
    card: Card;
    onDelete: (cardId: string) => void;
};

export function CardItem({ card, onDelete }: CardItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: card.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <article
            className={`kanban-card ${isDragging ? "is-dragging" : ""}`}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            data-testid={`card-${card.id}`}
        >
            <div className="kanban-card-head">
                <h3>{card.title}</h3>
                <button
                    type="button"
                    className="text-button"
                    onClick={() => onDelete(card.id)}
                    aria-label={`Delete ${card.title}`}
                >
                    Delete
                </button>
            </div>
            <p>{card.details}</p>
        </article>
    );
}
