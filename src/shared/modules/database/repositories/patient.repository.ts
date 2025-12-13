import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial, Repository } from 'typeorm';

import { Patient } from '../entities';
import { IPatientRepository } from '../interfaces/patient.interface';

@Injectable()
export class PatientRepository implements IPatientRepository {
  private readonly repository: Repository<Patient>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Patient);
  }

  getById(id: string) {
    return this.repository.findOneBy({ id });
  }

  getByDocumentNumber(documentNumber: string): Promise<Patient | null> {
    return this.repository.findOne({
      where: { documentNumber },
    });
  }

  create(dto: DeepPartial<Patient>): Promise<Patient> {
    const data: Patient = this.repository.create(dto);
    return this.repository.save(data);
  }
}
