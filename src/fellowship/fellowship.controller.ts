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
  Query,
  BadRequestException,
  HttpCode,
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
  ApiQuery,
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
import { SubmitUserObservationDto } from './dto/submit-user-observation-dto';

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

  @Get('all-programs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user', 'faculty')
  @ApiOperation({
    summary: 'Get all fellowship programs',
    description:
      'Fetch all fellowship programs with their associated batches. Includes SEO-friendly slugs for program and batch.',
  })
  @ApiOkResponse({
    description: 'List of all programs returned successfully',
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
            programImage:
              'https://primeradacademy.com/admin/support/uploads/banners/d42d72f3966f4e47e1e22ae336d90c72.png',
            programDuration: '6 months',
            programSlug: 'primerad-msk-mri-radiology-fellowship',
            batchId: 1,
            batchName: 'Batch 1',
            batchStart: '2025-09-01',
            batchEnd: '2025-12-31',
            moduleCount: 2,
            batchSlug: 'primerad-msk-mri-radiology-fellowship-batch-1',
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
  async getAllPrograms(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: any,
  ) {
    const regId = req.user.reg_id;
    return this.fellowshipService.getAllPrograms(
      Number(page),
      Number(limit),
      Number(regId),
    );
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
  @ApiQuery({ name: 'programId', type: Number, description: 'Program ID' })
  @ApiQuery({ name: 'batchId', type: Number, description: 'Batch ID' })
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

  @Get('sample-modules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user', 'faculty')
  @ApiOperation({
    summary: 'Get sample Modules',
    description:
      'Fetch 3 demo modules with 3 different session types each (no payment condition, always sample data).',
  })
  @ApiOkResponse({
    description: 'List of sample modules returned successfully',
    schema: {
      example: {
        success: true,
        counts: {
          modulesCount: 3,
          videosCount: 3,
          dicomCount: 3,
          assessmentCount: 3,
          certificateCount: 0,
          meetingCount: 0,
        },
        trackCount: 3,
        phases: [
          {
            phaseId: 1,
            phaseName: 'Track 1',
            phaseDescription: 'Phase 1 description',
            phaseImage: 'phase1.png',
            phaseStart: '2024-09-01',
            phaseEnd: '2024-10-01',
            modules: [
              {
                moduleId: 1,
                moduleName: 'Knee',
                moduleDescription: 'Knee basics',
                moduleImage: 'knee.png',
                programType: '0',
                sessions: [
                  {
                    sessionId: 101,
                    sessionName: 'Knee Intro',
                    sessionType: 'Video',
                  },
                  {
                    sessionId: 102,
                    sessionName: 'Knee Dicom',
                    sessionType: 'Dicom',
                  },
                  {
                    sessionId: 103,
                    sessionName: 'Knee Quiz',
                    sessionType: 'Assessment',
                  },
                ],
              },
            ],
          },
          {
            phaseId: 2,
            phaseName: 'Track 2',
            phaseDescription: 'Phase 2 description',
            phaseImage: 'phase2.png',
            phaseStart: '2024-10-01',
            phaseEnd: '2024-10-31',
            modules: [
              {
                moduleId: 2,
                moduleName: 'Shoulder',
                moduleDescription: 'Shoulder basics',
                moduleImage: 'shoulder.png',
                programType: '0',
                sessions: [
                  {
                    sessionId: 201,
                    sessionName: 'Shoulder Video',
                    sessionType: 'Video',
                  },
                  {
                    sessionId: 202,
                    sessionName: 'Shoulder Dicom',
                    sessionType: 'Dicom',
                  },
                  {
                    sessionId: 203,
                    sessionName: 'Shoulder Quiz',
                    sessionType: 'Assessment',
                  },
                ],
              },
            ],
          },
          {
            phaseId: 3,
            phaseName: 'Track 3',
            phaseDescription: 'Phase 3 description',
            phaseImage: 'phase3.png',
            phaseStart: '2024-11-01',
            phaseEnd: '2024-11-30',
            modules: [
              {
                moduleId: 3,
                moduleName: 'Spine',
                moduleDescription: 'Spine basics',
                moduleImage: 'spine.png',
                programType: '0',
                sessions: [
                  {
                    sessionId: 301,
                    sessionName: 'Spine Video',
                    sessionType: 'Video',
                  },
                  {
                    sessionId: 302,
                    sessionName: 'Spine Dicom',
                    sessionType: 'Dicom',
                  },
                  {
                    sessionId: 303,
                    sessionName: 'Spine Quiz',
                    sessionType: 'Assessment',
                  },
                ],
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
  @ApiQuery({ name: 'programId', type: Number, description: 'Program ID' })
  @ApiQuery({ name: 'batchId', type: Number, description: 'Batch ID' })
  async getSamplePhasesAndModules(@Req() req: any) {
    const programId = req.query.programId;
    const batchId = req.query.batchId;
    return this.fellowshipService.getProgramSampleDetails(programId, batchId);
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
  @ApiQuery({
    name: 'programId',
    type: Number,
    required: true,
    description: 'ID of the program',
  })
  @ApiQuery({
    name: 'batchId',
    type: Number,
    required: true,
    description: 'ID of the batch',
  })
  @ApiQuery({
    name: 'phaseId',
    type: Number,
    required: true,
    description: 'ID of the phase',
  })
  @ApiQuery({
    name: 'moduleId',
    type: Number,
    required: true,
    description: 'ID of the module',
  })
  async getSessionsByModule(@Req() req: any) {
    const { programId, batchId, phaseId, moduleId } = req.query;
    const regId = req.user.reg_id;
    return this.fellowshipService.getSessionsByModule(
      regId,
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
  @ApiQuery({ name: 'page', type: Number, description: 'Page' })
  @ApiQuery({ name: 'limit', type: Number, description: 'Limit' })
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
  @ApiParam({ name: 'sessionId', type: Number, description: 'Session ID' })
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
  @ApiParam({ name: 'sessionId', type: Number, description: 'Session ID' })
  async getAssessmentQuestions(@Req() req: any) {
    const sessionId = Number(req.params.sessionId);
    return this.fellowshipService.getAssessmentQuestions(sessionId);
  }

  @Get('answers/:sessionId')
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
  @ApiParam({ name: 'sessionId', type: Number, description: 'Session ID' })
  async getAssessmentAnswers(@Req() req: any) {
    const sessionId = Number(req.params.sessionId);
    const regId = req.user.reg_id;
    return this.fellowshipService.getAssessmentAnswers(sessionId, regId);
  }

  @Post('submit/:sessionId')
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
  @ApiParam({ name: 'sessionId', type: Number, description: 'Session ID' })
  async submitAssessmentAnswers(
    @Req() req: any,
    @Body() body: { answers: { questionId: number; answer: string }[] },
  ) {
    const sessionId = Number(req.params.sessionId);
    const regId = req.user.reg_id;
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
  @ApiParam({ name: 'sessionId', type: Number, description: 'Session ID' })
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
    const regId = req.user.reg_id;
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
    const regId = req.user.reg_id;
    return this.fellowshipService.createQuery(dto, regId);
  }

  @Put(':sessionId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
    const regId = req.user.reg_id;
    const result = await this.fellowshipService.updateSessionStatus(
      regId,
      sessionId,
      body.status,
    );
    return result;
  }

  @Get('observation-titles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get DICOM observation titles by sessionId' })
  @ApiQuery({ name: 'sessionId', required: true, type: Number })
  async getObservationTitles(@Query('sessionId') sessionId: number) {
    const titles = await this.fellowshipService.getObservationTitlesBySession(
      Number(sessionId),
    );
    return { success: true, data: titles };
  }

  @Get('faculty-observations')
  @ApiOperation({
    summary: 'Get faculty observations for non-empty observation titles',
  })
  @ApiQuery({ name: 'sessionId', required: true, type: Number })
  async getFacultyObservations(@Query('sessionId') sessionId: number) {
    const data = await this.fellowshipService.getFacultyObservationsBySession(
      Number(sessionId),
    );
    return { success: true, data };
  }

  @Post('submit-observations')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Submit user observations (save or final submit)' })
  @ApiResponse({
    status: 200,
    description: 'Observations submitted successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          obsTitleId: { type: 'number', example: 101 },
          userObs: {
            type: 'string',
            example: 'There is a mild abnormality in the left lung.',
          },
        },
        required: ['obsTitleId', 'userObs'],
      },
      example: [
        {
          obsTitleId: 101,
          userObs: 'There is a mild abnormality in the left lung.',
        },
        {
          obsTitleId: 102,
          userObs: 'The heart size appears within normal limits.',
        },
        {
          obsTitleId: 103,
          userObs: 'Signs of calcification observed near the spine.',
        },
      ],
    },
  })
  async submitUserObservations(@Body() body: any, @Request() req: any) {
    const regId = req.user.reg_id;

    if (!Array.isArray(body)) {
      throw new BadRequestException('Body must be an array of observations');
    }

    return this.fellowshipService.submitUserObservations(body, regId);
  }

  @Get('compare-observations/:sessionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Compare user and faculty observations for a session',
  })
  @ApiParam({
    name: 'sessionId',
    type: Number,
    example: 12,
    description: 'Session ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Comparison of user and faculty observations',
  })
  async compareObservations(
    @Param('sessionId') sessionId: number,
    @Request() req: any,
  ) {
    const regId = req.user.reg_id;
    return this.fellowshipService.compareObservations(sessionId, regId);
  }

  @Get(':id/dicom-video-url')
  @ApiOperation({ summary: 'Get DICOM video URL for a session' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the session',
    type: Number,
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the DICOM video URL for the given session',
    // type: DicomVideoUrlResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Session not found',
  })
  async getDicomVideoUrl(@Param('id', ParseIntPipe) id: number) {
    const url = await this.fellowshipService.getDicomVideoUrl(id);
    return { dicomVideoUrl: url };
  }
}
