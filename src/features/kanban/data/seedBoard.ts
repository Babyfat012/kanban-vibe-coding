import { BoardState } from "../types";

export const seedBoard: BoardState = {
    columnOrder: ["todo", "in-progress", "review", "blocked", "done"],
    columns: {
        todo: {
            id: "todo",
            name: "To Do",
            cardIds: ["card-1", "card-2"],
        },
        "in-progress": {
            id: "in-progress",
            name: "In Progress",
            cardIds: ["card-3"],
        },
        review: {
            id: "review",
            name: "Review",
            cardIds: ["card-4"],
        },
        blocked: {
            id: "blocked",
            name: "Blocked",
            cardIds: ["card-5"],
        },
        done: {
            id: "done",
            name: "Done",
            cardIds: ["card-6"],
        },
    },
    cards: {
        "card-1": {
            id: "card-1",
            title: "Define launch scope",
            details: "Lock MVP requirements with product and design.",
        },
        "card-2": {
            id: "card-2",
            title: "Create wireframes",
            details: "Draft board, column, and card layouts.",
        },
        "card-3": {
            id: "card-3",
            title: "Build Kanban UI",
            details: "Implement board shell and seeded data flow.",
        },
        "card-4": {
            id: "card-4",
            title: "Review accessibility",
            details: "Check keyboard focus and color contrast.",
        },
        "card-5": {
            id: "card-5",
            title: "Resolve flaky test",
            details: "Stabilize drag and drop integration flow.",
        },
        "card-6": {
            id: "card-6",
            title: "Prepare demo",
            details: "Record walkthrough for stakeholder review.",
        },
    },
};
