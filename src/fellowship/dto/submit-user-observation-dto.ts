import { ApiProperty } from '@nestjs/swagger';

export class SubmitUserObservationDto {
  @ApiProperty({
    example: 7,
    description: 'Observation title ID from tbl_dicom_obs_titles',
  })
  obsTitleId: number;

  @ApiProperty({
    example: ['Mild lesion', 'Clear', 'Normal', 'Abnormal findings'],
    description: 'Array of user-entered observations',
    // isArray: true,
    type: String,
  })
  userObs: string;
}
