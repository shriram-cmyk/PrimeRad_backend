import {
  Controller,
  Get,
  Post,
  Req,
  Put,
  Request,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FellowshipService } from './fellowship.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateQueryResponseDto } from './dto/create-query-response-dto';
import { CreateQueryDto } from './dto/create-query-dto';
import { UpdateSessionStatusDto } from './dto/update-session-status-dto';
import { ParseIntPipe } from '@nestjs/common';

class CapturedProgramDto {
  programId: number;
  programName: string;
  batchId: number | null;
  payStatus: string;
}

class CapturedProgramsResponseDto {
  success: boolean;
  data: CapturedProgramDto[];
}

@ApiTags('Fellowship')
@ApiBearerAuth('access-token')
@Controller('fellowship')
export class FellowshipController {
  constructor(private readonly fellowshipService: FellowshipService) {}

  @Get('captured-programs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user', 'faculty')
  @ApiOperation({
    summary: 'Get user captured programs',
    description:
      'Fetch all fellowship programs where the logged-in user has completed payment with `pay_status = captured`.',
  })
  @ApiOkResponse({
    description: 'List of captured programs returned successfully',
    schema: {
      example: {
        success: true,
        pagination: {
          page: 1,
          limit: 10,
          total: 4,
          totalPages: 1,
        },
        data: [
          {
            programId: 1,
            programName: 'PrimeRad MSK MRI Radiology Fellowship',
            programShortname: 'MSK',
            programUrl: 'http://localhost/primeradacademy',
            programTitle: 'PRIME MSK MRI FELLOWSHIP',
            programDescription:
              'The fellowship aims to bring a world class fellowship trained faculty from across the globe providing high quality and simplified education material, real life MRI cases and live discussions',
            programImage: 'd42d72f3966f4e47e1e22ae336d90c72.png',
            programDuration: '6 months',
            batchId: 1,
            batchName: 'Batch 1',
            batchStart: '2025-09-01',
            batchEnd: '2025-12-31',
            enrolledDate: '2024-02-29',
            moduleCount: 2,
            payStatus: 'captured',
          },
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Bearer token missing or invalid',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getMyCapturedPrograms(@Req() req: any) {
    const regId = req.user.reg_id;
    return this.fellowshipService.getCapturedProgramsByUser(regId);
  }

  @Get('captured-modules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user', 'faculty')
  @ApiOperation({
    summary: 'Get user Modules',
    description:
      'Fetch all fellowship Modules where the logged-in user has completed payment with `pay_status = captured`.',
  })
  @ApiOkResponse({
    description: 'List of captured Modules returned successfully',
    schema: {
      example: {
        success: true,
        counts: {
          modulesCount: 2,
          videosCount: 3,
          dicomCount: 4,
          assessmentCount: 5,
          certificateCount: 8,
          meetingCount: 6,
        },
        trackCount: 3,
        phases: [
          {
            phaseId: 1,
            phaseName: 'Track 1',
            phaseDescription: 'Phase 1 description',
            phaseImage: '0f7ab6f8bb7e8a6c194fa0e13486da11.png',
            phaseStart: '2024-09-01',
            phaseEnd: '2024-10-01',
            moduleCount: 5,
            modules: [
              {
                moduleId: 1,
                moduleName: 'Knee',
                moduleDescription: 'Knee description',
                moduleImage: 'b0ed8cb1caf71046cf6d476f0f11c069.jpg',
                moduleStart: '2024-09-01',
                module2Start: null,
                module3Start: null,
                programType: '0',
              },
            ],
          },
          {
            phaseId: 2,
            phaseName: 'Track 2',
            phaseDescription: 'Phase 2 description',
            phaseImage: '0f7ab6f8bb7e8a6c194fa0e13486da11.png',
            phaseStart: '2024-10-01',
            phaseEnd: '2024-10-31',
            moduleCount: 5,
            modules: [
              {
                moduleId: 1,
                moduleName: 'Knee',
                moduleDescription: 'Knee description',
                moduleImage: 'b0ed8cb1caf71046cf6d476f0f11c069.jpg',
                moduleStart: '2024-09-01',
                module2Start: null,
                module3Start: null,
                programType: '0',
              },
              {
                moduleId: 2,
                moduleName: 'Shoulder',
                moduleDescription: 'Shoulder description',
                moduleImage: 'b092c62993a6ae1709474ed79dc34a7d.jpg',
                moduleStart: '2024-10-01',
                module2Start: null,
                module3Start: null,
                programType: '0',
              },
            ],
          },
          {
            phaseId: 3,
            phaseName: 'Track 3',
            phaseDescription: 'Phase 3 description',
            phaseImage: '0f7ab6f8bb7e8a6c194fa0e13486da11.png',
            phaseStart: '2024-10-31',
            phaseEnd: '2024-11-30',
            moduleCount: 5,
            modules: [
              {
                moduleId: 1,
                moduleName: 'Knee',
                moduleDescription: 'Knee description',
                moduleImage: 'b0ed8cb1caf71046cf6d476f0f11c069.jpg',
                moduleStart: '2024-09-01',
                module2Start: null,
                module3Start: null,
                programType: '0',
              },
            ],
          },
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Bearer token missing or invalid',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getPhasesAndModules(@Req() req: any) {
    const regId = req.user.reg_id;
    const programId = req.query.program_id;
    const batchId = req.query.batch_id;
    return this.fellowshipService.getProgramDetailsByUser(
      regId,
      programId,
      batchId,
    );
  }

  @Get('sessions-by-module')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user', 'faculty')
  @ApiOperation({
    summary: 'Get sessions for a specific module',
    description:
      'Fetch all sessions for a given module, grouped by session type.',
  })
  @ApiOkResponse({
    description: 'Grouped sessions returned successfully',
    schema: {
      example: {
        success: true,
        sessions: {
          Assessment: [
            {
              name: 'Program 1-Batch 1-Phase 1-Module 1-1',
              progress: 100,
            },
          ],
          Vimeo: [
            {
              name: 'Program 1-Batch 1-Phase 1-Module 1-2',
              progress: 100,
            },
          ],
          Dicom: [
            {
              name: '1212',
              progress: 0,
            },
          ],
        },
        progress: {
          Assessment: 100,
          Vimeo: 100,
          Dicom: 0,
        },
      },
    },
  })
  async getSessionsByModule(@Req() req: any) {
    const { programId, batchId, phaseId, moduleId } = req.query;

    return this.fellowshipService.getSessionsByModule(
      Number(programId),
      Number(batchId),
      Number(phaseId),
      Number(moduleId),
    );
  }

  @Get('all-sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user', 'faculty')
  @ApiOperation({
    summary: 'Get all sessions',
    description: 'Fetch all sessions across all modules with pagination.',
  })
  @ApiOkResponse({
    description: 'All sessions returned successfully',
    schema: {
      example: {
        success: true,
        pagination: {
          page: 1,
          limit: 10,
          total: 45,
          totalPages: 5,
        },
        data: [
          {
            sessionName: 'Introduction to Fellowship',
            sessionType: 'Lecture',
            startDate: '2025-09-01',
            endDate: '2025-09-01',
          },
        ],
      },
    },
  })
  async getAllSessions(@Req() req: any) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    return this.fellowshipService.getAllSessions(page, limit);
  }

  @Get('session-details/:sessionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user', 'faculty')
  @ApiOperation({
    summary: 'Get session details',
    description:
      'Fetch details for a specific session. Returns Zoom details if live, DICOM details if dicom type, or generic details otherwise.',
  })
  @ApiOkResponse({
    description: 'Session details fetched successfully',
    schema: {
      example: {
        success: true,
        data: {
          sessionId: 101,
          sessionName: 'Intro to Cardiology',
          sessionType: 'Live',
          zoomMeetingId: '123-456-789',
          zoomStartdate: '2025-09-15 10:00:00',
          zoomEnddate: '2025-09-15 12:00:00',
          zoomPassword: 'abcd1234',
          zoomLiveLink: 'https://zoom.us/j/123456789',
        },
      },
    },
  })
  async getSessionDetails(@Req() req: any) {
    const sessionId = Number(req.params.sessionId);
    return this.fellowshipService.getSessionDetails(sessionId);
  }

  @Get('questions/:sessionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user', 'faculty')
  @ApiOperation({
    summary: 'Get assessment questions for a session',
    description:
      'Fetch assessment questions with answer options (no correct answers).',
  })
  @ApiOkResponse({
    description: 'Assessment questions fetched successfully',
    schema: {
      example: {
        success: true,
        data: [
          {
            assessmentQuestionId: 1,
            assessmentQuestion: 'What is the normal heart rate range?',
            assessmentQuestionDescription: 'Choose the correct range',
            answerOptionA: '40-60 bpm',
            answerOptionB: '60-100 bpm',
            answerOptionC: '100-120 bpm',
            answerOptionD: '120-160 bpm',
            questionImage: 'default_image',
          },
        ],
      },
    },
  })
  async getAssessmentQuestions(@Req() req: any) {
    const sessionId = Number(req.params.sessionId);
    return this.fellowshipService.getAssessmentQuestions(sessionId);
  }

  @Get('answers/:sessionId/:regId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user', 'faculty')
  @ApiOperation({
    summary: 'Get user answers for a session',
    description: 'Fetch user answers along with correctness (true/false).',
  })
  @ApiOkResponse({
    description: 'User answers fetched successfully',
    schema: {
      example: {
        success: true,
        data: [
          {
            questionId: 1,
            question: 'What is the normal heart rate range?',
            options: {
              A: '40-60 bpm',
              B: '60-100 bpm',
              C: '100-120 bpm',
              D: '120-160 bpm',
            },
            userAnswer: 'B',
            correctAnswer: 'B',
            isCorrect: true,
          },
        ],
      },
    },
  })
  async getAssessmentAnswers(@Req() req: any) {
    const sessionId = Number(req.params.sessionId);
    const regId = Number(req.params.regId);
    return this.fellowshipService.getAssessmentAnswers(sessionId, regId);
  }

  @Post('submit/:sessionId/:regId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user', 'faculty')
  @ApiOperation({
    summary: 'Submit assessment answers',
    description:
      'Submit user answers for a session. Stores in tblAssessmentUseranswer.',
  })
  @ApiOkResponse({
    description: 'Answers submitted successfully',
    schema: {
      example: {
        success: true,
        message: 'Answers submitted successfully',
      },
    },
  })
  async submitAssessmentAnswers(
    @Req() req: any,
    @Body() body: { answers: { questionId: number; answer: string }[] },
  ) {
    const sessionId = Number(req.params.sessionId);
    const regId = Number(req.params.regId);
    return this.fellowshipService.submitAssessmentAnswers(
      sessionId,
      regId,
      body.answers,
    );
  }

  @Get('session-queries/:sessionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user', 'faculty')
  @ApiOperation({
    summary: 'Get queries with responses for a session',
    description: 'Fetch all queries posted in a session along with responses.',
  })
  @ApiOkResponse({
    description: 'Session queries fetched successfully',
    schema: {
      example: {
        success: true,
        data: [
          {
            queryId: 1,
            message: 'What is the difference between MRI and CT scan?',
            anonymous: '1',
            anonymousName: 'Anonymous',
            likesCount: 5,
            dislikesCount: 0,
            createdDate: '2025-09-16 10:00:00',
            responses: [
              {
                responseId: 101,
                response: 'MRI is better for soft tissues.',
                regId: 22,
                createdDate: '2025-09-16 10:30:00',
              },
            ],
          },
        ],
      },
    },
  })
  async getSessionQueries(@Req() req: any) {
    const sessionId = Number(req.params.sessionId);
    return this.fellowshipService.getSessionQueriesWithResponses(sessionId);
  }

  @Post('query-responses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('faculty', 'admin')
  @ApiOperation({ summary: 'Post a new response to a query' })
  @ApiOkResponse({
    description: 'Response posted successfully',
    schema: {
      example: {
        success: true,
        data: {
          queryResponseId: 101,
          queriesId: 1,
          regId: 10,
          response: 'MRI is better for soft tissues.',
          createdDate: '2025-09-16 12:15:00',
        },
      },
    },
  })
  async createQueryResponse(
    @Body() dto: CreateQueryResponseDto,
    @Request() req: any,
  ) {
    const regId = req.user.sub;
    return this.fellowshipService.createQueryResponse(dto, regId);
  }

  @Post('queries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'faculty', 'admin')
  @ApiOperation({ summary: 'Post a new query' })
  @ApiOkResponse({
    description: 'Query posted successfully',
    schema: {
      example: {
        success: true,
        data: {
          queriesId: 1,
          sessionId: 101,
          message: 'What is the difference between MRI and CT scan?',
          anonymous: '1',
          anonymousName: 'Anonymous',
          createdDate: '2025-09-16 12:00:00',
        },
      },
    },
  })
  async createQuery(@Body() dto: CreateQueryDto, @Request() req: any) {
    const regId = req.user.sub;
    return this.fellowshipService.createQuery(dto, regId);
  }

  @Put(':sessionId/status')
  @ApiOperation({ summary: 'Update or create session status' })
  @ApiParam({ name: 'sessionId', type: Number, description: 'Session ID' })
  @ApiBody({
    description: 'Session status to update',
    type: UpdateSessionStatusDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Session status updated or created successfully',
    schema: {
      example: {
        success: true,
        message: 'Session status updated successfully',
      },
    },
  })
  async updateSessionStatus(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() body: UpdateSessionStatusDto,
    @Request() req: any,
  ) {
    const regId = req.user.sub;
    const result = await this.fellowshipService.updateSessionStatus(
      regId,
      sessionId,
      body.status,
    );
    return result;
  }
}
