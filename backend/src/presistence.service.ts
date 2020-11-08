import {Injectable, OnApplicationBootstrap, OnApplicationShutdown} from "@nestjs/common";
import { ConfigService} from '@nestjs/config'
import {PoolOptions} from "mysql2";
import {Pool, createPool, RowDataPacket, OkPacket, ResultSetHeader, FieldPacket} from "mysql2/promise";
import { v4 as uuidv4 } from 'uuid'

import {KboardDatabase} from 'common/persistence'
import {KboardSummary, Kboard, Kcard} from "common/models";

const SQL_GET_KBOARDS = 'select * from kboard_summary where user_id like ? limit ? offset ?';

const SQL_GET_KBOARD = `
	select c.*, b.* from kboard b
		left join kcard c
		on b.board_id = c.board_id
		where b.user_id = ? and b.board_id = ?
`

const SQL_INSERT_KBOARD = `
	insert into kboard(board_id, user_id, title, comments, created_on)
	values (?, ?, ?, ?, from_unixtime(? / 1000))
`

const SQL_DELETE_KBOARD = 'delete from kboard where user_id = ? and board_id = ?'

const SQL_UPDATE_KBOARD = `
	set @ok = false;
	call update_kboard(?, @ok);
	select @ok; 
`;

const SQL_INSERT_KCARD = `
	insert into kcard(board_id, description, priority)
	values (?, ?, ?)
`

type mkQueryResult = [ RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] 
		| ResultSetHeader, FieldPacket[] ]

type mkQueryFunction = (p: any[]) => Promise<mkQueryResult>;

const mkQuery = function(sql: string, pool: Pool) {
	return async function(params: any[]): Promise<mkQueryResult> {
		const conn = await pool.getConnection()
		try {
			return conn.query(sql, params)
		} catch(e) {
			console.error(`ERROR: ${sql}: `, e)
			return Promise.reject(e)
		} finally {
			conn.release()
		}
	}
}

@Injectable()
export class PersistenceService 
	implements OnApplicationBootstrap, OnApplicationShutdown, KboardDatabase {

	private options: PoolOptions;
	private pool: Pool;

	private _getKboard: mkQueryFunction;
	private _deleteKboard: mkQueryFunction;
	private _updateKboard: mkQueryFunction;

	constructor(configSvc: ConfigService) {
		this.options = {
			host: configSvc.get<string>('DB_HOST', 'localhost'),
			port: configSvc.get<number>('DB_PORT', 3306),
			database: configSvc.get<string>('DB_NAME', 'neatstack'),
			user: configSvc.get<string>('DB_USER', 'barney'),
			password: configSvc.get<string>('DB_PASSWORD', 'barney'),
			timezone: configSvc.get<string>('DB_TIMEZONE', '+08:00'),
			connectionLimit: configSvc.get<number>('DB_CONNECTION_LIMIT', 2),
			multipleStatements: true
		}
	}

	async insertKboard(board: Partial<Kboard>): Promise<string> {
		const boardId = uuidv4().toString().substring(0, 8)
		const createdOn = (new Date()).getTime()
		const conn = await this.pool.getConnection();
		try {
			await conn.beginTransaction()
			// insert kboard, createdBy - user_id not email 
			await conn.query(SQL_INSERT_KBOARD,
				[ boardId, board.createdBy, board.title, board.comments, createdOn ])
			
			// for every kcard - perform an insert
			if (board.cards) 
				await Promise.all(
					board.cards.map(
						c => conn.query(SQL_INSERT_KCARD, 
							[ boardId, c.description, c.priority ])
					)
				)
			await conn.commit()
		} catch(e) {
			await conn.rollback()
			console.error('ERROR: insertKboard: ', e)
			return Promise.reject(e)
		} finally {
			conn.release()
		}
		return boardId
	}

	async deleteKboard(userId: string, boardId: string): Promise<boolean> {
		const [ result ] = await this._deleteKboard([ userId, boardId ]) as OkPacket[]
		return (result.affectedRows > 0)
	}

	async updateKboard(board: Kboard): Promise<boolean> {
		// result is a 3D array, 
		// 1D - number of SQL statements executed - 3
		// 2D - result from executing every statement
		// 3D - field(s) of each record
		const [ result, _ ] = await this._updateKboard([ JSON.stringify(board) ]);
		const ok = result[2][0]['@ok']
		console.info(`@ok: ${ok}`)
		return (!!ok);
	}

	async getKboard(userId: string, boardId: string): Promise<Kboard> {
		const [ result, _ ] = await this._getKboard([ userId, boardId ]) as RowDataPacket[][]
		if (!result.length)
			return null
		const kboard: Kboard = {
			boardId: result[0].board_id,
			createdOn: new Date(result[0].created_on).getTime(),
			updatedOn: result[0].updated_on? new Date(result[0].updated_on).getTime(): null,
			title: result[0].title,
			createdBy: result[0].user_id,
			comments: result[0].comments,
			cards: []
		}

		if (result[0].card_id)
			kboard.cards = result.map(r => {
				return {
					description: r.description,
					priority: r.priority
				} as Kcard
			})
		return kboard
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
					createdBy: r['user_id'],
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

			this._getKboard = mkQuery(SQL_GET_KBOARD, this.pool)
			this._deleteKboard = mkQuery(SQL_DELETE_KBOARD, this.pool)
			this._updateKboard = mkQuery(SQL_UPDATE_KBOARD, this.pool)
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
