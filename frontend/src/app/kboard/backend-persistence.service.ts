import { Injectable } from '@angular/core'

import { KboardDatabase } from 'common/persistence'
import { Kboard, KboardSummary } from 'common/models'
import { HttpClient, HttpParams } from '@angular/common/http'
import { DeleteKboardResponse, GetKboardResponse, 
	GetKboardsResponse, PostKboardResponse, PutKboardResponse } from 'common/response'
import { IdentityService } from '../identity.service'

@Injectable()
export class BackendPersistenceService implements KboardDatabase {

	constructor(private http: HttpClient, private idSvc: IdentityService) { }

	// GET /api/kboards/:userId
	getKboards(userId: string, limit = 10, offset = 0): Promise<KboardSummary[]> {
		const url = `http://localhost:8080/api/kboards/${userId}`
		const params = (new HttpParams())
				.set('limit', `${limit}`)
				.set('offset', `${offset}`)

		return this.http.get<GetKboardsResponse>(url, { params })
				.toPromise()
				.then(resp => resp.data)
	}

	// GET /api/kboard/:userId/:boardId
	getKboard(userId: string, boardId: string): Promise<Kboard> {
		const url = `http://localhost:8080/api/kboard/${userId}/${boardId}`

		return this.http.get<GetKboardResponse>(url)
				.toPromise()
				.then(resp => resp.data)
	}

	// DELETE /api/kboard/:userId/:boardId
	deleteKboard(userId: string, boardId: string): Promise<boolean> {
		const url = `http://localhost:8080/api/kboard/${userId}/${boardId}`

		return this.http.delete<DeleteKboardResponse>(url)
				.toPromise()
				.then(resp => resp.data)
	}

	// POST /api/kboard/:userId
	insertKboard(board: Partial<Kboard>): Promise<string> {
		const url = `http://localhost:8080/api/kboard/${this.idSvc.getUserId()}`

		return this.http.post<PostKboardResponse>(url, board)
				.toPromise()
				.then(resp => resp.data)
	}

	// PUT /api/kboard/:userId/:boardId
	updateKboard(board: Kboard): Promise<boolean> {
		const url = `http://localhost:8080/api/kboard/${this.idSvc.getUserId()}/${board.boardId}`
		return this.http.put<PutKboardResponse>(url, board)
				.toPromise()
				.then(resp => resp.data)
	}
}
