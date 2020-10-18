import { Controller, Get, Param, InternalServerErrorException, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common';

import { KboardDatabase } from 'common/persistence'
import {PersistenceService} from 'src/presistence.service';
import { GetKboardResponse } from 'common/response'
import { Kboard } from 'common/models';

@Controller('kboard/:userId')
export class KboardController {

	private kboardDB: KboardDatabase

	constructor(persistSvc: PersistenceService) {
		this.kboardDB = persistSvc
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

		return {
			timestamp: (new Date()).getTime(),
			statusCode: HttpStatus.OK,
			data: result
		} as GetKboardResponse
	}
}
