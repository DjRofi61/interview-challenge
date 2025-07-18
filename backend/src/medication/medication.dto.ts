import { IsString } from 'class-validator';

export class CreateMedicationDto {
  @IsString()
  name: string;

  @IsString()
  dosage: string;

  @IsString()
  frequency: string;
}

export class UpdateMedicationDto {
  @IsString()
  name?: string;

  @IsString()
  dosage?: string;

  @IsString()
  frequency?: string;
} 