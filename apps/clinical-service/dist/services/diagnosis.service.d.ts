import { ClinicalRepository } from '../repositories/clinical.repository';
export declare class DiagnosisService {
    private readonly clinicalRepository;
    constructor(clinicalRepository: ClinicalRepository);
    registerDiagnosis(payload: {
        encounterId?: string;
        description?: string;
    }): Promise<import("../domain/diagnosis.entity").DiagnosisEntity>;
}
