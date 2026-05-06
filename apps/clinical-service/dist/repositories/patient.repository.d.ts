import { ClinicalRecordEntity } from '../domain/clinical-record.entity';
import { PatientEntity } from '../domain/patient.entity';
import { DatabaseService } from '../services/database.service';
export declare class PatientRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(payload: {
        tenantId: string;
        name: string;
        document: string;
        birthDate: string;
    }): Promise<PatientEntity>;
    findByIdAndTenant(patientId: string, tenantId: string): Promise<PatientEntity | null>;
    createClinicalRecord(patientId: string): Promise<ClinicalRecordEntity>;
    findClinicalRecordByPatientId(patientId: string): Promise<ClinicalRecordEntity | null>;
    private mapPatient;
    private mapRecord;
}
