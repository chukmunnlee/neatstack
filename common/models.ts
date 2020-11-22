export interface KboardSummary {
	userId: string;
	boardId: string;
	createdBy: string;
	title: string;
	cardCount: number;
}

export interface Kboard {
	boardId: string;
	createdOn: number;
	updatedOn?: number;
	title: string;
	createdBy: string;
	comments: string;
	cards: Kcard[]
}

export interface Kcard {
	description: string;
	priority: Priority | number;
}

export enum Priority {
	Low = 0, Medium, High
}
