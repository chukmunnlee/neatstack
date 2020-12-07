import { Controller, Get, HttpCode, HttpStatus, InternalServerErrorException } from '@nestjs/common'

import {PersistenceService} from 'src/presistence.service';
import {KboardDatabase} from 'common/persistence';
import { GetHealthzResponse } from 'common/response';
import { mkResponse } from 'common/utils';

@Controller('healthz')
export class HealthzController {

	private kboardDB: KboardDatabase

	constructor(persistSvc: PersistenceService) { 
		this.kboardDB = persistSvc
	}

	@Get()
	async healthz(): Promise<GetHealthzResponse> {
		try {
			await this.kboardDB.getKboards('%', 1)
			return mkResponse<GetHealthzResponse>(HttpStatus.OK)
		} catch(e) {
			console.error('ERROR: healthz: ', e)
			throw new InternalServerErrorException(e)
		}
	}
}
