import { DeepPartial, UpdateResult } from 'typeorm';

import { AgendaException } from '../entities';

export interface IAgendaExceptionRepository {
  getByDoctorIdAndPeriod(
    doctorId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AgendaException[]>;
  create(dto: DeepPartial<AgendaException>): Promise<AgendaException>;
  update(id: string, partial: Partial<AgendaException>): Promise<UpdateResult>;
  softDelete(id: string): Promise<UpdateResult>;
}
