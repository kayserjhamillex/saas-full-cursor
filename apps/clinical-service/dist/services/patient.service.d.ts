import { ClinicalRepository } from '../repositories/clinical.repository';
import { PatientRepository } from '../repositories/patient.repository';
export declare class PatientService {
    private readonly patientRepository;
    private readonly clinicalRepository;
    constructor(patientRepository: PatientRepository, clinicalRepository: ClinicalRepository);
    createPatient(payload: {
        tenantId?: string;
        name?: string;
        document?: string;
        birthDate?: string;
    }): Promise<{
        patient: import("../domain/patient.entity").PatientEntity;
        clinicalRecord: import("../domain/clinical-record.entity").ClinicalRecordEntity;
        events: string[];
    }>;
    getPatient(tenantId: string, patientId: string): Promise<import("../domain/patient.entity").PatientEntity>;
}
