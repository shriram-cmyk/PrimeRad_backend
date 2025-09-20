import { Module } from '@nestjs/common';
import { OpenAccessController } from './open-access.controller';
import { OpenAccessService } from './open-access.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [OpenAccessController],
  providers: [OpenAccessService],
  exports: [OpenAccessService],
})
export class OpenAccessModule {}
