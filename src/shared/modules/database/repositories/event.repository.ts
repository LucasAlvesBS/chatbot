import { Injectable } from '@nestjs/common';
import { DATE_PARAMETER } from '@shared/constants';
import {
  Between,
  DataSource,
  DeepPartial,
  EntityManager,
  Repository,
  UpdateResult,
} from 'typeorm';

import { Event } from '../entities';
import { IEventRepository } from '../interfaces/event.interface';

@Injectable()
export class EventRepository implements IEventRepository {
  private readonly repository: Repository<Event>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Event);
  }

  getManager() {
    return this.dataSource.createEntityManager();
  }

  getById(id: string): Promise<Event | null> {
    return this.repository.findOne({ where: { id } });
  }

  getByReferenceId(referenceId: string): Promise<Event | null> {
    return this.repository.findOne({
      where: { referenceId },
    });
  }

  existsByStartDate(startDate: Date): Promise<boolean> {
    return this.repository.existsBy({
      startDate: Between(
        new Date(startDate.getTime() - DATE_PARAMETER.SAFETY_INTERVAL_IN_MS),
        new Date(startDate.getTime() + DATE_PARAMETER.SAFETY_INTERVAL_IN_MS),
      ),
    });
  }

  existsByIdempotencyKey(idempotencyKey: string): Promise<boolean> {
    return this.repository.existsBy({ idempotencyKey });
  }

  create(
    dto: DeepPartial<Event>,
    entityManager?: EntityManager,
  ): Promise<Event> {
    const data: Event = this.repository.create(dto);

    if (entityManager) {
      return entityManager.save(Event, data);
    }

    return this.repository.save(data);
  }

  update(id: string, partial: Partial<Event>) {
    return this.repository.update(id, partial);
  }

  softDelete(id: string): Promise<UpdateResult> {
    return this.repository.softDelete(id);
  }
}
