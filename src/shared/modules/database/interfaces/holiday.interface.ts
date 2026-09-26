import { DeepPartial } from 'typeorm';

import { Holiday } from '../entities';

export interface IHolidayRepository {
  getByPeriod(startDate: Date, endDate: Date): Promise<Holiday[]>;
  create(dto: DeepPartial<Holiday>): Promise<Holiday>;
}
