import { Exclude } from 'class-transformer';
import { DeleteDateColumn, UpdateDateColumn } from 'typeorm';

import { PartialBaseEntity } from './partialBase.entity';

export abstract class CompleteBaseEntity extends PartialBaseEntity {
  @Exclude({ toPlainOnly: false })
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Exclude({ toPlainOnly: false })
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
