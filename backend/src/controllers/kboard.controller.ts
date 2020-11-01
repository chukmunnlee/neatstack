import { Controller, 
	Get, Post, Delete,
	Param, Body,
	InternalServerErrorException, NotFoundException, 
	HttpCode, HttpStatus, 
} from '@nestjs/common';

import { KboardDatabase } from 'common/persistence'
import {PersistenceService} from 'src/presistence.service';
import { GetKboardResponse, PostKboardResponse, DeleteKboardResponse } from 'common/response'
import { Kboard } from 'common/models';
import { mkResponse } from 'common/utils'

@Controller('kboard/:userId')
export class KboardController {

	private kboardDB: KboardDatabase

	constructor(persistSvc: PersistenceService) {
		this.kboardDB = persistSvc
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async postKboard(@Body() payload: any): Promise<PostKboardResponse> {
		try {
			const boardId = await this.kboardDB.insertKboard(payload)
			const response = mkResponse<PostKboardResponse>(HttpStatus.CREATED)
			response.data = boardId;
			return response
		} catch(e) {
			console.error('ERROR: postKboard: ', e)
			throw new InternalServerErrorException(e)
		}
	}

	@Delete(':boardId')
	@HttpCode(HttpStatus.OK)
	async deleteKboard(@Param('userId') userId: string,
			@Param('boardId') boardId: string): Promise<DeleteKboardResponse> {

		try {
			const response = mkResponse<DeleteKboardResponse>(HttpStatus.OK)
			response.data = await this.kboardDB.deleteKboard(userId, boardId)
			return response
		} catch(e) {
			console.error('ERROR: deleteKboard: ', e)
			return Promise.reject(e)
		}
	}

	@Get(':boardId')
	@HttpCode(HttpStatus.OK)
	async getKboard(@Param('userId') userId: string,
			@Param('boardId') boardId: string): Promise<GetKboardResponse> {

		let result: Kboard;
		try {
			result = await this.kboardDB.getKboard(userId, boardId)
		} catch(e) {
			console.error(`ERROR: getKboard: `, e)
			throw new InternalServerErrorException(e)
		}

		if (!result)
			throw new NotFoundException(`Board ${boardId} not found`)

		const response = mkResponse<GetKboardResponse>(HttpStatus.OK);
		response.data = result
		return response
	}
}
