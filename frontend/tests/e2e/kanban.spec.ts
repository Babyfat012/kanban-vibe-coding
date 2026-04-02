import { expect, test } from "@playwright/test";

test("loads seeded board with 5 columns", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Project Delivery" })).toBeVisible();
    await expect(page.locator("section[data-testid^='column-']")).toHaveCount(5);
    await expect(page.getByText("Define launch scope")).toBeVisible();
});

test("adds and deletes a card", async ({ page }) => {
    await page.goto("/");

    const todoColumn = page.getByTestId("column-todo");
    await todoColumn.getByPlaceholder("Card title").fill("E2E card");
    await todoColumn.getByPlaceholder("Card details").fill("E2E details");
    await todoColumn.getByRole("button", { name: "Add Card" }).click();

    await expect(todoColumn.getByText("E2E card")).toBeVisible();
    await todoColumn.getByRole("button", { name: "Delete E2E card" }).click();
    await expect(todoColumn.getByText("E2E card")).toHaveCount(0);
});
