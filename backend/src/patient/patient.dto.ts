import { IsString, IsDateString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  name: string;

  @IsDateString()
  dateOfBirth: string;
}

export class UpdatePatientDto {
  @IsString()
  name?: string;

  @IsDateString()
  dateOfBirth?: string;
} 