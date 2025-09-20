import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Request,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OpenAccessService } from './open-access.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('open-access')
@Controller('open-access')
@ApiBearerAuth()
export class OpenAccessController {
  constructor(private readonly openaccessService: OpenAccessService) {}

  @Get('items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get open access items',
    description:
      'Fetches both sessions (programType=1) and polls for a given module, merged into a single list.',
  })
  @ApiQuery({
    name: 'type',
    type: String,
    required: false,
    description: 'Filter items by type: Dicom, Video, or Poll',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched open access items',
  })
  async getOpenAccessItems(
    @Request() req: any,
    @Query('type') type?: 'Dicom' | 'Video' | 'Poll',
  ) {
    const regId = req.user?.reg_id;
    if (!regId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.openaccessService.getOpenAccessItems(regId, type);
  }

  @Get('poll')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get polls with options and user status' })
  @ApiQuery({ name: 'pollId', type: Number, required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched poll(s)',
  })
  async getPolls(@Req() req: any, @Query('pollId') pollId?: number) {
    const regId = req.user?.reg_id;
    if (!regId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.openaccessService.getPolls(pollId);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit a poll response' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Poll submitted successfully',
  })
  async submitPoll(
    @Req() req: any,
    @Body() body: { pollId: number; optionId: number },
  ) {
    const regId = req.user?.reg_id;
    if (!regId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const { pollId, optionId } = body;
    return this.openaccessService.submitPoll(regId, pollId, optionId);
  }
}
