import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { FellowshipModule } from './fellowship/fellowship.module';
import { PacsAuthModule } from './pacs-dicom/pacs-dicom-auth.module';
import { OpenAccessModule } from './open-access/open-access.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          ttl: 60 * 5,
        }),
      }),
    }),
    LoggerModule,
    DbModule,
    UsersModule,
    AuthModule,
    FellowshipModule,
    PacsAuthModule,
    OpenAccessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
