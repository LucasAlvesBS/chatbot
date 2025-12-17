import { DeepPartial, EntityManager } from 'typeorm';

import { Patient } from '../entities';

export interface IPatientRepository {
  getById(id: string): Promise<Patient | null>;
  getByDocumentNumber(documentNumber: string): Promise<Patient | null>;
  create(
    dto: DeepPartial<Patient>,
    entityManager?: EntityManager,
  ): Promise<Patient>;
}
