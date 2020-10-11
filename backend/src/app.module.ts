import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import {PersistenceService} from './presistence.service';

import { KboardsController } from './controllers/kboards.controller';

@Module({
  imports: [ ConfigModule.forRoot() ],
  controllers: [KboardsController],
  providers: [ PersistenceService ],
})
export class AppModule {}
