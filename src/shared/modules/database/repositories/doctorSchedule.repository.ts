import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial, Repository, UpdateResult } from 'typeorm';

import { DoctorSchedule } from '../entities';
import { IDoctorScheduleRepository } from '../interfaces';

@Injectable()
export class DoctorScheduleRepository implements IDoctorScheduleRepository {
  private readonly repository: Repository<DoctorSchedule>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(DoctorSchedule);
  }

  getByDoctorId(doctorId: string): Promise<DoctorSchedule[]> {
    return this.repository.find({
      where: { doctorId },
    });
  }

  create(dto: DeepPartial<DoctorSchedule>): Promise<DoctorSchedule> {
    const entity = this.repository.create(dto);

    return this.repository.save(entity);
  }

  update(id: string, partial: Partial<DoctorSchedule>): Promise<UpdateResult> {
    return this.repository.update(id, partial);
  }

  softDelete(id: string): Promise<UpdateResult> {
    return this.repository.softDelete(id);
  }
}
