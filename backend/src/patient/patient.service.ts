import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientDto, UpdatePatientDto } from './patient.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  create(dto: CreatePatientDto) {
    const patient = this.patientRepository.create(dto);
    return this.patientRepository.save(patient);
  }

  findAll() {
    return this.patientRepository.find({ relations: ['assignments'] });
  }

  findOne(id: number) {
    return this.patientRepository.findOne({ where: { id }, relations: ['assignments'] });
  }

  async update(id: number, dto: UpdatePatientDto) {
    await this.patientRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    try {
      return await this.patientRepository.delete(id);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new BadRequestException('Cannot delete patient: they have one or more assignments.');
      }
      throw error;
    }
  }
} 