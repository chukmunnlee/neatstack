import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'

import * as morgan from 'morgan'
import * as yargs from 'yargs'
import * as dotenv from 'dotenv'

import { AppModule } from './app.module';
import {ValidationPipe} from '@nestjs/common';
import { ErrorHandlerFilter } from './utils/error-handler.filter';

// look for .env
dotenv.config()

// from CLI option, from environment, fallback to default 
const argv = yargs.option({
	port: { type: 'number', default: parseInt(process.env.PORT) || 3000 },
	cors: { type: 'boolean', default: false },
	clientPath: { type: 'string', default: '' }
}).argv

async function bootstrap(argv) {

	const port = argv.port
	const cors = argv.cors
	const clientPath = argv.clientPath

	process.env.CLIENT_PATH = clientPath

	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.enableShutdownHooks()
	if (cors)
		app.enableCors()

	app.setGlobalPrefix('api')

	app.useGlobalPipes(new ValidationPipe())
	app.useGlobalFilters(new ErrorHandlerFilter())

	app.disable('x-powered-by')

	app.use(morgan('combined'))

	app.listen(port)
		.then(() => {
			console.info(`Application started on port ${port} at ${new Date()}`)
			console.info(`\tCORS: ${cors}`)
			if (!!clientPath)
				console.info(`\tclientPath: ${clientPath}`)
		})
}

bootstrap(argv);
