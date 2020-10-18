import { KboardSummary, Kboard } from './models'

export interface KboardDatabase {
	getKboards(userId: string, limit?: number, offset?: number): Promise<KboardSummary[]>;

	getKboard(userId: string, boardId: string): Promise<Kboard>;
}
