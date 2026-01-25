import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';

import { Doctor } from './doctor.entity';
import { PartialBaseEntity } from './partialBase.entity';

@Entity('holidays')
export class ExceptionalDay extends PartialBaseEntity {
  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ name: 'start_date', type: 'timestamp', nullable: false })
  @Index()
  startDate: string;

  @Column({ name: 'end_date', type: 'timestamp', nullable: false })
  @Index()
  endDate: string;

  @Column({ name: 'doctor_id', type: 'varchar', nullable: false })
  @Index()
  doctorId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.exceptionalDays)
  @JoinColumn({ name: 'doctor_id', referencedColumnName: 'id' })
  doctor: Relation<Doctor>;
}
