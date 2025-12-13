import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial, Repository, UpdateResult } from 'typeorm';

import { Event } from '../entities';
import { IEventRepository } from '../interfaces/event.interface';

@Injectable()
export class EventRepository implements IEventRepository {
  private readonly repository: Repository<Event>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Event);
  }

  getById(id: string) {
    return this.repository.findOneBy({ id });
  }

  getByReferenceId(referenceId: string): Promise<Event | null> {
    return this.repository.findOne({
      where: { referenceId },
    });
  }

  create(dto: DeepPartial<Event>): Promise<Event> {
    const data: Event = this.repository.create(dto);
    return this.repository.save(data);
  }

  update(id: string, partial: Partial<Event>) {
    return this.repository.update(id, partial);
  }

  softDelete(id: string): Promise<UpdateResult> {
    return this.repository.softDelete(id);
  }
}
