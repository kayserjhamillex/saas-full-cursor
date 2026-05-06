import { ClinicalRepository } from '../repositories/clinical.repository';
import { PatientRepository } from '../repositories/patient.repository';
import { DiagnosisService } from './diagnosis.service';
import { TreatmentService } from './treatment.service';
export declare class ClinicalService {
    private readonly patientRepository;
    private readonly clinicalRepository;
    private readonly diagnosisService;
    private readonly treatmentService;
    constructor(patientRepository: PatientRepository, clinicalRepository: ClinicalRepository, diagnosisService: DiagnosisService, treatmentService: TreatmentService);
    createEncounter(payload: {
        tenantId?: string;
        patientId?: string;
        encounterDate?: string;
        notes?: string;
    }): Promise<{
        encounter: import("../domain/encounter.entity").EncounterEntity;
        event: string;
    }>;
    registerDiagnosis(payload: {
        tenantId?: string;
        patientId?: string;
        encounterId?: string;
        description?: string;
    }): Promise<{
        diagnosis: import("../domain/diagnosis.entity").DiagnosisEntity;
        event: string;
    }>;
    assignTreatment(payload: {
        tenantId?: string;
        patientId?: string;
        encounterId?: string;
        description?: string;
    }): Promise<{
        treatment: import("../domain/treatment.entity").TreatmentEntity;
        event: string;
    }>;
    createPrescription(payload: {
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
    registerEvolution(payload: {
        tenantId?: string;
        patientId?: string;
        encounterId?: string;
        notes?: string;
    }): Promise<{
        evolution: import("../domain/evolution.entity").EvolutionEntity;
        event: string;
    }>;
    updateOdontogram(payload: {
        tenantId?: string;
        patientId?: string;
        chartData?: Record<string, unknown>;
    }): Promise<import("../domain/odontogram.entity").OdontogramEntity>;
    getTimeline(tenantId: string, patientId: string): Promise<import("../domain/clinical-timeline.entity").ClinicalTimelineEntity[]>;
    private validatePatientContext;
}
