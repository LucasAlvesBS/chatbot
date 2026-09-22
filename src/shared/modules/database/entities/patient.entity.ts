import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  Relation,
} from 'typeorm';

import { BaseEntity } from './base.entity';
import { Consultation } from './consultation.entity';
import { User } from './user.entity';

@Entity('patients')
export class Patient extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'document_number', type: 'varchar', nullable: false })
  @Index()
  documentNumber: string;

  @OneToMany(() => Consultation, (consultation) => consultation.patient)
  consultations?: Relation<Consultation>[];

  @ManyToMany(() => User, (user) => user.patients)
  @JoinTable({
    name: 'users_patients',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'patient_id',
      referencedColumnName: 'id',
    },
  })
  users?: Relation<User>[];
}
