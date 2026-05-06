import { ClinicalRepository } from '../repositories/clinical.repository';
export declare class TreatmentService {
    private readonly clinicalRepository;
    constructor(clinicalRepository: ClinicalRepository);
    assignTreatment(payload: {
        encounterId?: string;
        description?: string;
    }): Promise<import("../domain/treatment.entity").TreatmentEntity>;
}
