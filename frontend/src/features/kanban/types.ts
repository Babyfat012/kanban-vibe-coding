export type Card = {
    id: string;
    title: string;
    details: string;
};

export type Column = {
    id: string;
    name: string;
    cardIds: string[];
};

export type BoardState = {
    columns: Record<string, Column>;
    cards: Record<string, Card>;
    columnOrder: string[];
};

export type RenameColumnAction = {
    type: "renameColumn";
    payload: {
        columnId: string;
        name: string;
    };
};

export type AddCardAction = {
    type: "addCard";
    payload: {
        columnId: string;
        title: string;
        details: string;
    };
};

export type DeleteCardAction = {
    type: "deleteCard";
    payload: {
        cardId: string;
    };
};

export type MoveCardAction = {
    type: "moveCard";
    payload: {
        cardId: string;
        sourceColumnId: string;
        destinationColumnId: string;
        destinationIndex: number;
    };
};

export type BoardAction =
    | RenameColumnAction
    | AddCardAction
    | DeleteCardAction
    | MoveCardAction;
