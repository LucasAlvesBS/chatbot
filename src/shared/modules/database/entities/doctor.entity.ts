import { Column, Entity, Index, OneToMany, Relation } from 'typeorm';

import { CompleteBaseEntity } from './completeBase.entity';
import { Event } from './event.entity';
import { ExceptionalDay } from './exceptionalDay.entity';

@Entity('doctors')
export class Doctor extends CompleteBaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'registration_number', type: 'varchar', nullable: false })
  @Index()
  registrationNumber: string;

  @OneToMany(() => Event, (event) => event.doctor)
  events?: Relation<Event>[];

  @OneToMany(() => ExceptionalDay, (event) => event.doctor)
  exceptionalDays?: Relation<ExceptionalDay>[];
}
