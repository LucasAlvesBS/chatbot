import { DayOfWeek } from '@shared/enums';
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

@Entity('doctor_schedules')
export class DoctorSchedule extends BaseEntity {
  @Column({
    name: 'day_of_week',
    type: 'enum',
    enum: DayOfWeek,
    nullable: false,
  })
  dayOfWeek: DayOfWeek;

  @Column({ name: 'start_time', type: 'time', nullable: false })
  startTime: string;

  @Column({ name: 'end_time', type: 'time', nullable: false })
  endTime: string;

  @Column({ name: 'doctor_id', type: 'varchar', nullable: false })
  @Index()
  doctorId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.agendaExceptions)
  @JoinColumn({ name: 'doctor_id', referencedColumnName: 'id' })
  doctor: Relation<Doctor>;
}
