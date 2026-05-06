import { PatientService } from '../services/patient.service';
export declare class PatientController {
    private readonly patientService;
    constructor(patientService: PatientService);
    createPatient(body: {
        tenantId?: string;
        name?: string;
        document?: string;
        birthDate?: string;
    }): Promise<{
        patient: import("../domain/patient.entity").PatientEntity;
        clinicalRecord: import("../domain/clinical-record.entity").ClinicalRecordEntity;
        events: string[];
    }>;
    getPatient(patientId: string, tenantId: string | undefined): Promise<import("../domain/patient.entity").PatientEntity>;
}
