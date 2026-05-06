import { AiResultEntity } from '../domain/ai-result.entity';
import { ClinicalTimelineEntity } from '../domain/clinical-timeline.entity';
import { EncounterEntity } from '../domain/encounter.entity';
import { EvolutionEntity } from '../domain/evolution.entity';
import { ImageEntity } from '../domain/image.entity';
import { OdontogramEntity } from '../domain/odontogram.entity';
import { PrescriptionEntity } from '../domain/prescription.entity';
import { DiagnosisEntity } from '../domain/diagnosis.entity';
import { TreatmentEntity } from '../domain/treatment.entity';
import { DatabaseService } from '../services/database.service';
export declare class ClinicalRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    createEncounter(payload: {
        recordId: string;
        encounterDate: string;
        notes: string;
    }): Promise<EncounterEntity>;
    findEncounterById(encounterId: string): Promise<EncounterEntity | null>;
    createDiagnosis(payload: {
        encounterId: string;
        description: string;
    }): Promise<DiagnosisEntity>;
    createTreatment(payload: {
        encounterId: string;
        description: string;
    }): Promise<TreatmentEntity>;
    createPrescription(payload: {
        encounterId: string;
        medication: string;
        dosage: string;
        instructions: string;
    }): Promise<PrescriptionEntity>;
    upsertOdontogram(patientId: string, chartData: Record<string, unknown>): Promise<OdontogramEntity>;
    createEvolution(payload: {
        encounterId: string;
        notes: string;
    }): Promise<EvolutionEntity>;
    createTimelineEvent(payload: {
        patientId: string;
        eventType: string;
        referenceId: string;
        description: string;
    }): Promise<ClinicalTimelineEntity>;
    getTimelineByPatientId(patientId: string): Promise<ClinicalTimelineEntity[]>;
    findEncounterByIdAndPatientId(encounterId: string, patientId: string): Promise<EncounterEntity | null>;
    createImage(payload: {
        tenantId: string;
        patientId: string;
        encounterId: string;
        imageName: string;
        mimeType: string;
        imageBase64: string;
    }): Promise<ImageEntity>;
    createAiResult(payload: {
        imageId: string;
        encounterId: string;
        finding: string;
        confidence: number;
        riskLevel: string;
        recommendations: string[];
        processingMs: number;
        modelType: string;
    }): Promise<AiResultEntity>;
    getAiResultsByPatientId(patientId: string): Promise<AiResultEntity[]>;
    private mapEncounter;
    private mapTimeline;
    private mapImage;
    private mapAiResult;
}
