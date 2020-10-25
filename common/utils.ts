import { Kboard } from './models'

import { ResponseBase } from './response'

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

export const mkResponse = function<T extends ResponseBase>(statusCode: number): T {
	return {
		timestamp: (new Date()).getTime(),
		statusCode
	} as T
}
