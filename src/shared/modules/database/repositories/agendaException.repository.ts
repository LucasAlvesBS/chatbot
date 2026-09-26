import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  LessThan,
  MoreThan,
  Repository,
  UpdateResult,
} from 'typeorm';

import { AgendaException } from '../entities';
import { IAgendaExceptionRepository } from '../interfaces';

@Injectable()
export class AgendaExceptionRepository implements IAgendaExceptionRepository {
  private readonly repository: Repository<AgendaException>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(AgendaException);
  }

  getByDoctorIdAndPeriod(
    doctorId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AgendaException[]> {
    return this.repository.find({
      where: {
        doctorId,
        startDate: LessThan(endDate),
        endDate: MoreThan(startDate),
      },
    });
  }

  create(dto: DeepPartial<AgendaException>): Promise<AgendaException> {
    const entity = this.repository.create(dto);

    return this.repository.save(entity);
  }

  update(id: string, partial: Partial<AgendaException>): Promise<UpdateResult> {
    return this.repository.update(id, partial);
  }

  softDelete(id: string): Promise<UpdateResult> {
    return this.repository.softDelete(id);
  }
}
