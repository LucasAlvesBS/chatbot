import { DeepPartial, EntityManager, UpdateResult } from 'typeorm';

import { Consultation } from '../entities';

export interface IConsultationRepository {
  getManager(): EntityManager;
  getById(id: string): Promise<Consultation | null>;
  getByReferenceId(registrationNumber: string): Promise<Consultation | null>;
  update(id: string, partial: Partial<Consultation>): Promise<UpdateResult>;
  create(
    dto: DeepPartial<Consultation>,
    entityManager?: EntityManager,
  ): Promise<Consultation>;
  softDelete(id: string): Promise<UpdateResult>;
}
