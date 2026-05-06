import { AiIntegrationService } from '../services/ai-integration.service';
import { ClinicalService } from '../services/clinical.service';
export declare class ClinicalController {
    private readonly clinicalService;
    private readonly aiIntegrationService;
    constructor(clinicalService: ClinicalService, aiIntegrationService: AiIntegrationService);
    createEncounter(body: {
        tenantId?: string;
        patientId?: string;
        encounterDate?: string;
        notes?: string;
    }): Promise<{
        encounter: import("../domain/encounter.entity").EncounterEntity;
        event: string;
    }>;
    registerDiagnosis(body: {
        tenantId?: string;
        patientId?: string;
        encounterId?: string;
        description?: string;
    }): Promise<{
        diagnosis: import("../domain/diagnosis.entity").DiagnosisEntity;
        event: string;
    }>;
    assignTreatment(body: {
        tenantId?: string;
        patientId?: string;
        encounterId?: string;
        description?: string;
    }): Promise<{
        treatment: import("../domain/treatment.entity").TreatmentEntity;
        event: string;
    }>;
    createPrescription(body: {
        tenantId?: string;
        patientId?: string;
        encounterId?: string;
        medication?: string;
        dosage?: string;
        instructions?: string;
    }): Promise<{
        prescription: import("../domain/prescription.entity").PrescriptionEntity;
        event: string;
    }>;
    registerEvolution(body: {
        tenantId?: string;
        patientId?: string;
        encounterId?: string;
        notes?: string;
    }): Promise<{
        evolution: import("../domain/evolution.entity").EvolutionEntity;
        event: string;
    }>;
    getTimeline(patientId: string, tenantId: string | undefined): Promise<import("../domain/clinical-timeline.entity").ClinicalTimelineEntity[]>;
    processImage(body: {
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
    getAiResults(patientId: string, tenantId: string | undefined): Promise<import("../domain/ai-result.entity").AiResultEntity[]>;
}
