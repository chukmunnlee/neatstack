import { Injectable } from '@angular/core'
import Dexie from 'dexie'
import { v4 as uuidv4 } from 'uuid'

import { Kboard } from '../../../../common/models'

@Injectable()
export class KboardService extends Dexie {

	private boards: Dexie.Table<Kboard>

	constructor() {
		// kboard the database name
		super('kboard')
		// create schema
		this.version(1).stores({
			boards: 'boardId'
		})

		this.boards = this.table('boards')
	}

	updateBoard(board: Kboard): Promise<number> {
		board.updatedOn = (new Date()).getTime()
		return (this.boards.update(board.boardId, board))
	}

	findBoardById(bId: string): Promise<Kboard> {
		return (this.boards.get(bId))
	}

	getBoards(): Promise<Kboard[]> {
		return (this.boards.toArray())
	}

	addBoard(b: Partial<Kboard>): Promise<string> {
		const boardId = uuidv4().substring(0, 8)
		const createdOn = (new Date()).getTime()
		const board: Kboard = {
			boardId, createdOn,
			title: b.title,
			createdBy: b.createdBy,
			comments: b.comments,
			cards: b.cards? b.cards: []
		}

		return (this.boards.add(board))
	}
}
