"use client";

import { FormEvent, useState } from "react";

type AddCardFormProps = {
    columnId: string;
    onAddCard: (columnId: string, title: string, details: string) => void;
};

export function AddCardForm({ columnId, onAddCard }: AddCardFormProps) {
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim()) {
            return;
        }

        onAddCard(columnId, title, details);
        setTitle("");
        setDetails("");
    };

    return (
        <form className="add-card-form" onSubmit={handleSubmit}>
            <label htmlFor={`${columnId}-title`} className="sr-only">
                Card title
            </label>
            <input
                id={`${columnId}-title`}
                name="title"
                placeholder="Card title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />

            <label htmlFor={`${columnId}-details`} className="sr-only">
                Card details
            </label>
            <textarea
                id={`${columnId}-details`}
                name="details"
                placeholder="Card details"
                rows={2}
                value={details}
                onChange={(event) => setDetails(event.target.value)}
            />

            <button type="submit" className="primary-button">
                Add Card
            </button>
        </form>
    );
}
