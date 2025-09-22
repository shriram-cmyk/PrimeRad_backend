import { Module } from '@nestjs/common';
import { FellowshipService } from './fellowship.service';
import { FellowshipController } from './fellowship.controller';
import { DbModule } from '../db/db.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    DbModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: '10.132.0.2', // works because WSL shares localhost
            port: 6379,
          },
          ttl: 3600,
        }),
      }),
    }),
  ],
  providers: [FellowshipService],
  controllers: [FellowshipController],
})
export class FellowshipModule {}
