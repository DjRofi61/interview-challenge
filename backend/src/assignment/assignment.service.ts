import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { CreateAssignmentDto, UpdateAssignmentDto } from './assignment.dto';
import { Patient } from '../patient/patient.entity';
import { Medication } from '../medication/medication.entity';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Medication)
    private medicationRepository: Repository<Medication>,
  ) {}

  async create(dto: CreateAssignmentDto) {
    const patient = await this.patientRepository.findOne({ where: { id: dto.patientId } });
    const medication = await this.medicationRepository.findOne({ where: { id: dto.medicationId } });
    if (!patient || !medication) throw new NotFoundException('Patient or Medication not found');
    const assignment = this.assignmentRepository.create({
      ...dto,
      patient,
      medication,
    });
    return this.assignmentRepository.save(assignment);
  }

  findAll() {
    return this.assignmentRepository.find({ relations: ['patient', 'medication'] });
  }

  findOne(id: number) {
    return this.assignmentRepository.findOne({ where: { id }, relations: ['patient', 'medication'] });
  }

  async update(id: number, dto: UpdateAssignmentDto) {
    const assignment = await this.assignmentRepository.findOne({ where: { id } });
    if (!assignment) throw new NotFoundException('Assignment not found');
    if (dto.patientId) {
      const patient = await this.patientRepository.findOne({ where: { id: dto.patientId } });
      if (!patient) throw new NotFoundException('Patient not found');
      assignment.patient = patient;
    }
    if (dto.medicationId) {
      const medication = await this.medicationRepository.findOne({ where: { id: dto.medicationId } });
      if (!medication) throw new NotFoundException('Medication not found');
      assignment.medication = medication;
    }
    if (dto.startDate) assignment.startDate = dto.startDate;
    if (dto.days) assignment.days = dto.days;
    return this.assignmentRepository.save(assignment);
  }

  remove(id: number) {
    return this.assignmentRepository.delete(id);
  }

  // Calcul des jours restants
  calculateRemainingDays(assignment: Assignment): number {
    const start = new Date(assignment.startDate);
    const now = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + assignment.days);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  }

  // Endpoint pour tous les assignments avec jours restants
  async findAllWithRemainingDays() {
    const assignments = await this.findAll();
    return assignments.map(a => ({
      ...a,
      remainingDays: this.calculateRemainingDays(a),
    }));
  }
} 