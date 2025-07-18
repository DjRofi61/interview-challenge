import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Patient } from '../patient/patient.entity';
import { Medication } from '../medication/medication.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, patient => patient.assignments, { eager: true })
  patient: Patient;

  @ManyToOne(() => Medication, medication => medication.assignments, { eager: true })
  medication: Medication;

  @Column({ type: 'date' })
  startDate: string;

  @Column()
  days: number;
} 