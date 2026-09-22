import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  Relation,
} from 'typeorm';

import { BaseEntity } from './base.entity';
import { Doctor } from './doctor.entity';
import { Patient } from './patient.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  @Index()
  phone: string;

  @Column({
    name: 'is_blocked',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isBlocked: boolean;

  @Column({
    name: 'blocked_until',
    type: 'timestamp',
    nullable: true,
  })
  blockedUntil: Date;

  @OneToMany(() => Doctor, (doctor) => doctor.user)
  doctors?: Relation<Doctor>[];

  @ManyToMany(() => Patient, (patient) => patient.users)
  patients?: Relation<Patient>[];
}
