import { KboardSummary } from './models'

export interface KboardDatabase {
	getKboards(userId: string, limit?: number, offset?: number): Promise<KboardSummary[]>
}
