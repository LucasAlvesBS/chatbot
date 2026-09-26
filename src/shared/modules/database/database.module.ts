import { dataSourceOptions } from '@config/typeorm';
import { Logger, Module, Provider } from '@nestjs/common';
import { PROVIDERS } from '@shared/constants';
import { DataSource } from 'typeorm';

import { IDatabaseProviders } from './interfaces';
import {
  AgendaExceptionRepository,
  ConsultationRepository,
  DoctorRepository,
  DoctorScheduleRepository,
  HolidayRepository,
  PatientRepository,
} from './repositories';

export const dataSource = new DataSource(dataSourceOptions);

const databaseProviders: Provider[] = [
  {
    provide: PROVIDERS.DATABASE_PROVIDER,
    useFactory: async (): Promise<IDatabaseProviders> => {
      const logger = new Logger(PROVIDERS.DATABASE_PROVIDER);

      try {
        await dataSource.initialize();

        return {
          repositories: {
            agendaExceptionRepository: new AgendaExceptionRepository(
              dataSource,
            ),
            consultationRepository: new ConsultationRepository(dataSource),
            doctorRepository: new DoctorRepository(dataSource),
            doctorScheduleRepository: new DoctorScheduleRepository(dataSource),
            holidayRepository: new HolidayRepository(dataSource),
            patientRepository: new PatientRepository(dataSource),
          },
        };
      } catch (error) {
        logger.error(error);
        throw error;
      }
    },
  },
];

@Module({
  providers: databaseProviders,
  exports: databaseProviders,
})
export class DatabaseModule {}
