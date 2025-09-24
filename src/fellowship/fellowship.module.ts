import { Module } from '@nestjs/common';
import { FellowshipService } from './fellowship.service';
import { FellowshipController } from './fellowship.controller';
import { DbModule } from '../db/db.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    DbModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 3600,
      max: 1000,
    }),
  ],
  providers: [FellowshipService],
  controllers: [FellowshipController],
})
export class FellowshipModule {}
