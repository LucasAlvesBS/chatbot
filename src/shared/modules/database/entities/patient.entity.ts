import { Column, Entity, Index, OneToMany, Relation } from 'typeorm';

import { CompleteBaseEntity } from './completeBase.entity';
import { Event } from './event.entity';

@Entity('patients')
export class Patient extends CompleteBaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'document_number', type: 'varchar', nullable: false })
  @Index()
  documentNumber: string;

  @OneToMany(() => Event, (event) => event.patient)
  events?: Relation<Event>[];
}
