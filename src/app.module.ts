import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { FellowshipModule } from './fellowship/fellowship.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    DbModule,
    UsersModule,
    AuthModule,
    FellowshipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
