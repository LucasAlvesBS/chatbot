import { DeepPartial, EntityManager, UpdateResult } from 'typeorm';

import { Event } from '../entities';

export interface IEventRepository {
  getManager(): EntityManager;
  getById(id: string): Promise<Event | null>;
  getByReferenceId(registrationNumber: string): Promise<Event | null>;
  update(id: string, partial: Partial<Event>): Promise<UpdateResult>;
  create(
    dto: DeepPartial<Event>,
    entityManager?: EntityManager,
  ): Promise<Event>;
  softDelete(id: string): Promise<UpdateResult>;
}
