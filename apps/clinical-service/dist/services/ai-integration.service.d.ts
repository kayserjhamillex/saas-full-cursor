import { ClinicalRepository } from '../repositories/clinical.repository';
import { PatientRepository } from '../repositories/patient.repository';
export declare class AiIntegrationService {
    private readonly patientRepository;
    private readonly clinicalRepository;
    private readonly aiServiceUrl;
    constructor(patientRepository: PatientRepository, clinicalRepository: ClinicalRepository);
    processImage(payload: {
        tenantId?: string;
        patientId?: string;
        encounterId?: string;
        imageName?: string;
        mimeType?: string;
        imageBase64?: string;
        modelType?: string;
    }): Promise<{
        image: import("../domain/image.entity").ImageEntity;
        aiResult: import("../domain/ai-result.entity").AiResultEntity;
    }>;
    getResultsByPatient(tenantId?: string, patientId?: string): Promise<import("../domain/ai-result.entity").AiResultEntity[]>;
    private callAiService;
}
