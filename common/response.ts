import {KboardSummary, Kboard} from './models'

export interface ResponseBase {
	timestamp: number;
	statusCode: number;
	data: any;
}

export interface GetKboardsResponse extends ResponseBase {
	data: KboardSummary[];
	limit: number;
	offset: number;
}

export interface GetKboardResponse extends ResponseBase {
	data: Kboard;
}
