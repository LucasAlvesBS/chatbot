import { DeepPartial, UpdateResult } from 'typeorm';

import { DoctorSchedule } from '../entities';

export interface IDoctorScheduleRepository {
  getByDoctorId(doctorId: string): Promise<DoctorSchedule[]>;
  create(dto: DeepPartial<DoctorSchedule>): Promise<DoctorSchedule>;
  update(id: string, partial: Partial<DoctorSchedule>): Promise<UpdateResult>;
  softDelete(id: string): Promise<UpdateResult>;
}
