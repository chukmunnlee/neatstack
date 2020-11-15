import {Catch, HttpException, ExceptionFilter, ArgumentsHost} from '@nestjs/common'
import {Response} from 'express'
import {mkResponse} from 'common/utils'
import {KboardErrorResponse} from 'common/response'

@Catch(HttpException)
export class ErrorHandlerFilter implements ExceptionFilter {

	catch(ex: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const resp = ctx.getResponse<Response>()
		const errCode = ex.getStatus()

		const errResp = mkResponse<KboardErrorResponse>(errCode)
		errResp.message = ex.message
		//
		if (!!ex.getResponse())
			// @ts-ignore
			errResp.data = ex.getResponse()?.message
		else
			errResp.data = []

		resp.status(errCode).json(errResp)
	}
}
