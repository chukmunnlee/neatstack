import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import {PersistenceService} from './presistence.service';

@Module({
  imports: [ ConfigModule.forRoot() ],
  controllers: [],
  providers: [ PersistenceService ],
})
export class AppModule {}
