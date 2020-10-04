import {Injectable, OnApplicationBootstrap, OnApplicationShutdown} from "@nestjs/common";
import { ConfigService} from '@nestjs/config'
import {PoolOptions} from "mysql2";
import {Pool, createPool} from "mysql2/promise";

@Injectable()
export class PersistenceService implements OnApplicationBootstrap, OnApplicationShutdown {

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
