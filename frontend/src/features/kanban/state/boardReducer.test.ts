import { describe, expect, it } from "vitest";
import { seedBoard } from "../data/seedBoard";
import { boardReducer } from "./boardReducer";

describe("boardReducer", () => {
    it("renames a column", () => {
        const next = boardReducer(seedBoard, {
            type: "renameColumn",
            payload: { columnId: "todo", name: "Backlog" },
        });

        expect(next.columns.todo.name).toBe("Backlog");
    });

    it("adds a card into a column", () => {
        const next = boardReducer(seedBoard, {
            type: "addCard",
            payload: {
                columnId: "todo",
                title: "New card",
                details: "Details",
            },
        });

        expect(next.columns.todo.cardIds.length).toBe(seedBoard.columns.todo.cardIds.length + 1);
        const newCardId = next.columns.todo.cardIds[next.columns.todo.cardIds.length - 1];
        expect(next.cards[newCardId].title).toBe("New card");
    });

    it("deletes a card", () => {
        const next = boardReducer(seedBoard, {
            type: "deleteCard",
            payload: { cardId: "card-1" },
        });

        expect(next.cards["card-1"]).toBeUndefined();
        expect(next.columns.todo.cardIds).not.toContain("card-1");
    });

    it("moves card inside same column", () => {
        const next = boardReducer(seedBoard, {
            type: "moveCard",
            payload: {
                cardId: "card-2",
                sourceColumnId: "todo",
                destinationColumnId: "todo",
                destinationIndex: 0,
            },
        });

        expect(next.columns.todo.cardIds).toEqual(["card-2", "card-1"]);
    });

    it("moves card to another column", () => {
        const next = boardReducer(seedBoard, {
            type: "moveCard",
            payload: {
                cardId: "card-1",
                sourceColumnId: "todo",
                destinationColumnId: "done",
                destinationIndex: 1,
            },
        });

        expect(next.columns.todo.cardIds).toEqual(["card-2"]);
        expect(next.columns.done.cardIds).toEqual(["card-6", "card-1"]);
    });

    it("replaces the board state", () => {
        const replacement = {
            ...seedBoard,
            columnOrder: ["todo"],
        };

        const next = boardReducer(seedBoard, {
            type: "replaceBoard",
            payload: { board: replacement },
        });

        expect(next.columnOrder).toEqual(["todo"]);
    });
});
