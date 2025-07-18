import { IsInt, IsDateString, Min } from 'class-validator';

export class CreateAssignmentDto {
  @IsInt()
  patientId: number;

  @IsInt()
  medicationId: number;

  @IsDateString()
  startDate: string;

  @IsInt()
  @Min(1)
  days: number;
}

export class UpdateAssignmentDto {
  @IsInt()
  patientId?: number;

  @IsInt()
  medicationId?: number;

  @IsDateString()
  startDate?: string;

  @IsInt()
  @Min(1)
  days?: number;
} 