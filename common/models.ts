export interface Kboard {
	boardId: string;
	createdOn: number;
	title: string;
	createdBy: string;
	comments: string;
	cards: Kcard[]
}

export interface Kcard {
	description: string;
	priority: Priority;
}

export enum Priority {
	Low = 0, Medium, High
}
