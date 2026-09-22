import { Column, Entity, Index, OneToMany, Relation } from 'typeorm';

import { AgendaException } from './agendaException.entity';
import { BaseEntity } from './base.entity';
import { Consultation } from './consultation.entity';

@Entity('doctors')
export class Doctor extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'registration_number', type: 'varchar', nullable: false })
  @Index()
  registrationNumber: string;

  @OneToMany(() => Consultation, (consultation) => consultation.doctor)
  consultations?: Relation<Consultation>[];

  @OneToMany(() => AgendaException, (event) => event.doctor)
  agendaExceptions?: Relation<AgendaException>[];
}
