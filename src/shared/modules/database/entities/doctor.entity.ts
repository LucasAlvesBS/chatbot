import { Column, Entity, Index, OneToMany, Relation } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Event } from './event.entity';

@Entity('doctors')
export class Doctor extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'registration_number', type: 'varchar', nullable: false })
  @Index()
  registrationNumber: string;

  @OneToMany(() => Event, (event) => event.doctor)
  events?: Relation<Event>[];
}
