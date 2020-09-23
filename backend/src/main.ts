import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'

import * as morgan from 'morgan'
import * as yargs from 'yargs'
import * as dotenv from 'dotenv'

import { AppModule } from './app.module';

// look for .env
dotenv.config()

// from CLI option, from environment, fallback to default 
const argv = yargs.option({
	port: { type: 'number', default: parseInt(process.env.PORT) || 3000 }
}).argv

async function bootstrap(port: number) {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.disable('x-powered-by')

	app.use(morgan('combined'))

	app.listen(port)
		.then(() => {
			console.info(`Application started on port ${port} at ${new Date()}`)
		})
}
bootstrap(argv.port);
