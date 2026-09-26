import { Injectable } from '@nestjs/common';
import {
  And,
  DataSource,
  DeepPartial,
  LessThan,
  MoreThanOrEqual,
  Repository,
  UpdateResult,
} from 'typeorm';

import { Holiday } from '../entities';
import { IHolidayRepository } from '../interfaces';

@Injectable()
export class HolidayRepository implements IHolidayRepository {
  private readonly repository: Repository<Holiday>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Holiday);
  }

  getByPeriod(startDate: Date, endDate: Date): Promise<Holiday[]> {
    return this.repository.find({
      where: {
        date: And(MoreThanOrEqual(startDate), LessThan(endDate)),
      },
    });
  }

  create(dto: DeepPartial<Holiday>): Promise<Holiday> {
    const entity = this.repository.create(dto);

    return this.repository.save(entity);
  }

  update(id: string, partial: Partial<Holiday>): Promise<UpdateResult> {
    return this.repository.update(id, partial);
  }

  softDelete(id: string): Promise<UpdateResult> {
    return this.repository.softDelete(id);
  }
}
