import {
  ConsultationRepository,
  DoctorRepository,
  PatientRepository,
} from '../repositories';

export interface IDatabaseProviders {
  repositories: {
    consultationRepository: ConsultationRepository;
    doctorRepository: DoctorRepository;
    patientRepository: PatientRepository;
  };
}
