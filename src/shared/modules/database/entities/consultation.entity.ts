import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';

import { BaseEntity } from './base.entity';
import { Doctor } from './doctor.entity';
import { Patient } from './patient.entity';

@Entity('consultations')
export class Consultation extends BaseEntity {
  @Column({ name: 'doctor_id', type: 'varchar', nullable: false })
  @Index()
  doctorId: string;

  @Column({ name: 'patient_id', type: 'varchar', nullable: false })
  @Index()
  patientId: string;

  @Column({ name: 'reference_id', type: 'varchar', nullable: false })
  @Index()
  referenceId: string;

  @Column({ name: 'idempotency_key', type: 'varchar', nullable: false })
  idempotencyKey: string;

  @Column({ name: 'start_date', type: 'timestamp', nullable: false })
  startDate: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.consultations)
  @JoinColumn({ name: 'doctor_id', referencedColumnName: 'id' })
  doctor: Relation<Doctor>;

  @ManyToOne(() => Patient, (patient) => patient.consultations)
  @JoinColumn({ name: 'patient_id', referencedColumnName: 'id' })
  patient: Relation<Patient>;
}
