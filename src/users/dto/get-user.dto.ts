import { IsInt, Min } from 'class-validator';

export class GetUserDto {
  @IsInt()
  @Min(1)
  id: number;
}
