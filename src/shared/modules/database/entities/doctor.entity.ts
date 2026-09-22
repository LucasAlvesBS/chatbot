import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';

import { AgendaException } from './agendaException.entity';
import { BaseEntity } from './base.entity';
import { Consultation } from './consultation.entity';
import { User } from './user.entity';

@Entity('doctors')
export class Doctor extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'registration_number', type: 'varchar', nullable: false })
  @Index()
  registrationNumber: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  @Index()
  userId: string;

  @OneToMany(() => Consultation, (consultation) => consultation.doctor)
  consultations?: Relation<Consultation>[];

  @OneToMany(() => AgendaException, (event) => event.doctor)
  agendaExceptions?: Relation<AgendaException>[];

  @ManyToOne(() => User, (user) => user.doctors)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Relation<User>;
}
