import { Kboard } from './models'

export const mergeBoard = (p: Partial<Kboard>, b: Kboard): Kboard => {
	const board: Kboard = {
		boardId: b.boardId,
		createdOn: b.createdOn,
		title: p.title,
		createdBy: p.createdBy,
		comments: p.comments,
		cards: p.cards
	}

	return (board)
}
