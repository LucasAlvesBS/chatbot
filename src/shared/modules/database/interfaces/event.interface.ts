import { DeepPartial, UpdateResult } from 'typeorm';

import { Event } from '../entities';

export interface IEventRepository {
  getById(id: string): Promise<Event | null>;
  getByReferenceId(registrationNumber: string): Promise<Event | null>;
  update(id: string, partial: Partial<Event>): Promise<UpdateResult>;
  create(dto: DeepPartial<Event>): Promise<Event>;
  softDelete(id: string): Promise<UpdateResult>;
}
