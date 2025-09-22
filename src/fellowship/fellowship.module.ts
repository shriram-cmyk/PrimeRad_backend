import { Module } from '@nestjs/common';
import { FellowshipService } from './fellowship.service';
import { FellowshipController } from './fellowship.controller';
import { DbModule } from '../db/db.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    DbModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        socket: {
          host: process.env.REDIS_HOST || '10.132.0.2',
          port: Number(process.env.REDIS_PORT) || 6379,
        },
        ttl: 3600, // 1 hour
      }),
    }),
  ],
  providers: [FellowshipService],
  controllers: [FellowshipController],
})
export class FellowshipModule {}
