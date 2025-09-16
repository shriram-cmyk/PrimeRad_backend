import { Module } from '@nestjs/common';
import { FellowshipService } from './fellowship.service';
import { FellowshipController } from './fellowship.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [FellowshipService],
  controllers: [FellowshipController],
})
export class FellowshipModule {}
