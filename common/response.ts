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

export interface PostKboardResponse extends ResponseBase {
	data: string;
}

export interface DeleteKboardResponse extends ResponseBase {
	data: boolean;
}

export interface PutKboardResponse extends ResponseBase {
	data: boolean;
}
