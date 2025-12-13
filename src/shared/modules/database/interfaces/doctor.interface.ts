import { DeepPartial } from 'typeorm';

import { Doctor } from '../entities';

export interface IDoctorRepository {
  getById(id: string): Promise<Doctor | null>;
  getByRegistrationNumber(registrationNumber: string): Promise<Doctor | null>;
  create(dto: DeepPartial<Doctor>): Promise<Doctor>;
}
