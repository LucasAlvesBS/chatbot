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

@Entity('agenda_exceptions')
export class AgendaException extends BaseEntity {
  @Column({ name: 'start_date', type: 'timestamp', nullable: false })
  @Index()
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: false })
  @Index()
  endDate: Date;

  @Column({ name: 'doctor_id', type: 'varchar', nullable: false })
  @Index()
  doctorId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.agendaExceptions)
  @JoinColumn({ name: 'doctor_id', referencedColumnName: 'id' })
  doctor: Relation<Doctor>;
}
