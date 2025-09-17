import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PacsAuthService } from './pacs-dicom-auth.service';

@ApiTags('PACS Authentication')
@Controller('pacs-auth')
export class PacsAuthController {
  constructor(private readonly pacsAuthService: PacsAuthService) {}

  @Get('token')
  @ApiOperation({ summary: 'Get PACS access token' })
  @ApiResponse({
    status: 200,
    description: 'Access token retrieved successfully',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to fetch PACS access token',
  })
  async getToken() {
    const token = await this.pacsAuthService.getAccessToken();
    return { access_token: token };
  }
}
