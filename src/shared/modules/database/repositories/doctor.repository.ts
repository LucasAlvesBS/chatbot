import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial, Repository } from 'typeorm';

import { Doctor } from '../entities';
import { IDoctorRepository } from '../interfaces/doctor.interface';

@Injectable()
export class DoctorRepository implements IDoctorRepository {
  private readonly repository: Repository<Doctor>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Doctor);
  }

  getById(id: string) {
    return this.repository.findOneBy({ id });
  }

  getByRegistrationNumber(registrationNumber: string): Promise<Doctor | null> {
    return this.repository.findOne({
      where: { registrationNumber },
    });
  }

  create(dto: DeepPartial<Doctor>): Promise<Doctor> {
    const data: Doctor = this.repository.create(dto);
    return this.repository.save(data);
  }
}
