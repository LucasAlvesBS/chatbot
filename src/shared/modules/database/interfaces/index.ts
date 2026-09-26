import {
  AgendaExceptionRepository,
  ConsultationRepository,
  DoctorRepository,
  DoctorScheduleRepository,
  HolidayRepository,
  PatientRepository,
} from '../repositories';

export interface IDatabaseProviders {
  repositories: {
    agendaExceptionRepository: AgendaExceptionRepository;
    consultationRepository: ConsultationRepository;
    doctorRepository: DoctorRepository;
    doctorScheduleRepository: DoctorScheduleRepository;
    holidayRepository: HolidayRepository;
    patientRepository: PatientRepository;
  };
}

export * from './agendaException.interface';
export * from './consultation.interface';
export * from './doctor.interface';
export * from './doctorSchedule.interface';
export * from './holiday.interface';
export * from './patient.interface';
