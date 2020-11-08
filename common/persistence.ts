import { KboardSummary, Kboard } from './models'

export interface KboardDatabase {
	getKboards(userId: string, limit?: number, offset?: number): Promise<KboardSummary[]>;

	getKboard(userId: string, boardId: string): Promise<Kboard>;

	deleteKboard(userId: string, boardId: string): Promise<boolean>;

	insertKboard(board: Partial<Kboard>): Promise<string>;

	updateKboard(board: Kboard): Promise<boolean>;
}
