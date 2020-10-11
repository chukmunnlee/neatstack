import {Injectable, OnApplicationBootstrap, OnApplicationShutdown} from "@nestjs/common";
import { ConfigService} from '@nestjs/config'
import {PoolOptions} from "mysql2";
import {Pool, createPool, RowDataPacket} from "mysql2/promise";

import {KboardDatabase} from 'common/persistence'
import {KboardSummary} from "common/models";

const SQL_GET_KBOARDS = 'select * from kboard_summary where user_id like ? limit ? offset ?';

@Injectable()
export class PersistenceService 
	implements OnApplicationBootstrap, OnApplicationShutdown, KboardDatabase {

	private options: PoolOptions;
	private pool: Pool

	constructor(configSvc: ConfigService) {
		this.options = {
			host: configSvc.get<string>('DB_HOST', 'localhost'),
			port: configSvc.get<number>('DB_PORT', 3306),
			database: configSvc.get<string>('DB_NAME', 'neatstack'),
			user: configSvc.get<string>('DB_USER', 'barney'),
			password: configSvc.get<string>('DB_PASSWORD', 'barney'),
			timezone: configSvc.get<string>('DB_TIMEZONE', '+08:00'),
			connectionLimit: configSvc.get<number>('DB_CONNECTION_LIMIT', 2),
		}
	}

	async getKboards(userId: string, limit = 10, offset = 0): Promise<KboardSummary[]> {
		// get a connection from pool
		const conn = await this.pool.getConnection()
		try {
			// [ rec, fieldinfo ]
			const result = await conn.query(SQL_GET_KBOARDS, [ userId, limit, offset ]) as RowDataPacket[][]
			const recs = result[0] as RowDataPacket[]
			return recs.map(r => {
				return {
					userId: r['user_id'],
					createdBy: r['email'],
					boardId: r['board_id'],
					title: r['title'],
					cardCount: r['card_count']
				} as KboardSummary
			})
		} catch(e) {
			console.error('ERROR: getKboards: ', e)
			return Promise.reject(e)
		} finally {
			conn.release()
		}
	}

	async onApplicationBootstrap(): Promise<void> {
		// Create the connection pool
		this.pool = createPool(this.options)
		
		// Ping the pool
		const conn = await this.pool.getConnection()

		try {
			console.info('PINGing database')
			await conn.ping()
		} catch(e) {
			console.error('ERROR: Fail to PING database: ', e)
			return Promise.reject(e)
		} finally {
			conn.release()
		}
	}

	async onApplicationShutdown(signal: any): Promise<void> {
		console.info(`Received ${signal}. Application shutting down.`)
		await this.pool.end()
	}
}
