import {
  DoctorRepository,
  EventRepository,
  PatientRepository,
} from '../repositories';

export interface IDatabaseProviders {
  repositories: {
    doctorRepository: DoctorRepository;
    eventRepository: EventRepository;
    patientRepository: PatientRepository;
  };
}
