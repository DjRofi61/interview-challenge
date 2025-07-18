import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication } from './medication.entity';
import { CreateMedicationDto, UpdateMedicationDto } from './medication.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(Medication)
    private medicationRepository: Repository<Medication>,
  ) {}

  create(dto: CreateMedicationDto) {
    const medication = this.medicationRepository.create(dto);
    return this.medicationRepository.save(medication);
  }

  findAll() {
    return this.medicationRepository.find({ relations: ['assignments'] });
  }

  findOne(id: number) {
    return this.medicationRepository.findOne({ where: { id }, relations: ['assignments'] });
  }

  async update(id: number, dto: UpdateMedicationDto) {
    await this.medicationRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    try {
      return await this.medicationRepository.delete(id);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new BadRequestException('Cannot delete medication: it is assigned to one or more patients.');
      }
      throw error;
    }
  }
} 