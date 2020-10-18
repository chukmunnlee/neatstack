import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import {PersistenceService} from './presistence.service';

import { KboardsController } from './controllers/kboards.controller';
import { KboardController } from './controllers/kboard.controller';

@Module({
  imports: [ ConfigModule.forRoot() ],
  controllers: [KboardsController, KboardController],
  providers: [ PersistenceService ],
})
export class AppModule {}
