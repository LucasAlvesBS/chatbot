import { HolidaysType } from '@shared/enums';
import { Column, Entity, Index } from 'typeorm';

import { PartialBaseEntity } from './partialBase.entity';

@Entity('holidays')
export class Holiday extends PartialBaseEntity {
  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'enum', enum: HolidaysType, nullable: false })
  type: HolidaysType;

  @Column({ name: 'is_recurring', type: 'boolean', nullable: false })
  @Index()
  isRecurring: boolean;

  @Column({ name: 'country_code', type: 'varchar', nullable: false })
  countryCode: string;

  @Column({ name: 'state_code', type: 'varchar', nullable: true })
  stateCode: string;

  @Column({ name: 'city_code', type: 'varchar', nullable: true })
  cityCode: string;
}
