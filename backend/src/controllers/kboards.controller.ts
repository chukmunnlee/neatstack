import { Controller, Get, Param, Query, InternalServerErrorException, HttpCode } from '@nestjs/common';

import { KboardDatabase } from 'common/persistence'
import {PersistenceService} from 'src/presistence.service';
import {GetKboardsResponse} from 'common/response';

@Controller('kboards')
export class KboardsController {

	private kboardDB: KboardDatabase

	constructor(persistSvc: PersistenceService) {
		this.kboardDB = persistSvc
	}

	@Get(':userId')
	@HttpCode(200)
	async getKboards(@Param('userId') userId: string,
		@Query('limit') limit = '10', @Query('offset') offset = '0'): Promise<GetKboardsResponse> {

		try {
			const result = await this.kboardDB.getKboards(userId, parseInt(limit), parseInt(offset))
			return {
				timestamp: (new Date()).getTime(),
				statusCode: 200,
				data: result,
				limit: parseInt(limit),
				offset: parseInt(offset)
			} as GetKboardsResponse

		} catch(e) {
			console.error('ERROR: getKboards: ', e)
			// 500 status code
			throw new InternalServerErrorException(e)
		}
	}
}
