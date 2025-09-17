import { Module } from '@nestjs/common';
import { PacsAuthService } from './pacs-dicom-auth.service';
import { PacsAuthController } from './pacs-dicom-auth.controller';

@Module({
  providers: [PacsAuthService],
  controllers: [PacsAuthController],
})
export class PacsAuthModule {}
