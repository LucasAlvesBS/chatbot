import { Injectable } from '@nestjs/common';
import { DATE_PARAMETER } from '@shared/constants';
import { Order } from '@shared/enums';
import {
  Between,
  DataSource,
  DeepPartial,
  EntityManager,
  MoreThan,
  Repository,
  UpdateResult,
} from 'typeorm';

import { Consultation } from '../entities';
import { IConsultationRepository } from '../interfaces/consultation.interface';

@Injectable()
export class ConsultationRepository implements IConsultationRepository {
  private readonly repository: Repository<Consultation>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Consultation);
  }

  getManager() {
    return this.dataSource.createEntityManager();
  }

  getById(id: string): Promise<Consultation | null> {
    return this.repository.findOne({ where: { id } });
  }

  getByReferenceId(referenceId: string): Promise<Consultation | null> {
    return this.repository.findOne({
      where: { referenceId },
    });
  }

  getByDocumentNumber(documentNumber: string): Promise<Consultation | null> {
    return this.repository.findOne({
      where: {
        startDate: MoreThan(new Date()),
        patient: {
          documentNumber,
        },
      },
      order: { startDate: Order.ASC },
    });
  }

  existsByStartDate(startDate: Date): Promise<boolean> {
    return this.repository.existsBy({
      startDate: Between(
        new Date(startDate.getTime() - DATE_PARAMETER.SAFETY_INTERVAL_IN_MS),
        new Date(startDate.getTime() + DATE_PARAMETER.SAFETY_INTERVAL_IN_MS),
      ),
    });
  }

  existsByIdempotencyKey(idempotencyKey: string): Promise<boolean> {
    return this.repository.existsBy({ idempotencyKey });
  }

  create(
    dto: DeepPartial<Consultation>,
    entityManager?: EntityManager,
  ): Promise<Consultation> {
    const data: Consultation = this.repository.create(dto);

    if (entityManager) {
      return entityManager.save(Consultation, data);
    }

    return this.repository.save(data);
  }

  update(id: string, partial: Partial<Consultation>) {
    return this.repository.update(id, partial);
  }

  softDelete(referenceId: string): Promise<UpdateResult> {
    return this.repository.softDelete({ referenceId });
  }
}
