import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Board } from "./Board";

describe("Board", () => {
    it("renders seeded board with five columns", () => {
        render(<Board />);

        expect(screen.getByRole("heading", { name: "Project Delivery" })).toBeInTheDocument();
        expect(screen.getAllByTestId(/column-/)).toHaveLength(5);
        expect(screen.getByText("Define launch scope")).toBeInTheDocument();
    });

    it("renames a column", () => {
        render(<Board />);

        const input = screen.getByLabelText("Rename To Do column");
        fireEvent.change(input, { target: { value: "Backlog" } });

        expect(screen.getByDisplayValue("Backlog")).toBeInTheDocument();
    });

    it("adds and deletes card", () => {
        render(<Board />);

        const todoColumn = screen.getByTestId("column-todo");
        const titleInput = todoColumn.querySelector("input[placeholder='Card title']") as HTMLInputElement;
        const detailsInput = todoColumn.querySelector("textarea[placeholder='Card details']") as HTMLTextAreaElement;
        const addButton = screen.getAllByRole("button", { name: "Add Card" })[0];

        fireEvent.change(titleInput, { target: { value: "Unit card" } });
        fireEvent.change(detailsInput, { target: { value: "Unit details" } });
        fireEvent.click(addButton);

        expect(screen.getByText("Unit card")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Delete Unit card" }));
        expect(screen.queryByText("Unit card")).not.toBeInTheDocument();
    });
});
