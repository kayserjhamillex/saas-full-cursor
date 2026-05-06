/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return -- Infraestructura SQL con driver pg */
import { Injectable } from '@nestjs/common';
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

type EncounterRow = {
  id: string;
  record_id: string;
  encounter_date: Date;
  notes: string;
  created_at: Date;
  deleted_at: Date | null;
};

type DiagnosisRow = {
  id: string;
  encounter_id: string;
  description: string;
  created_at: Date;
};

type TreatmentRow = {
  id: string;
  encounter_id: string;
  description: string;
  created_at: Date;
};

type PrescriptionRow = {
  id: string;
  encounter_id: string;
  medication: string;
  dosage: string;
  instructions: string;
  created_at: Date;
};

type OdontogramRow = {
  id: string;
  patient_id: string;
  chart_data: Record<string, unknown>;
  updated_at: Date;
};

type EvolutionRow = {
  id: string;
  encounter_id: string;
  notes: string;
  created_at: Date;
};

type TimelineRow = {
  id: string;
  patient_id: string;
  event_type: string;
  reference_id: string;
  description: string;
  event_date: Date;
};

type ImageRow = {
  id: string;
  tenant_id: string;
  patient_id: string;
  encounter_id: string;
  image_name: string;
  mime_type: string;
  image_base64: string;
  created_at: Date;
};

type AiResultRow = {
  id: string;
  image_id: string;
  encounter_id: string;
  finding: string;
  confidence: number;
  risk_level: string;
  recommendations: string[];
  processing_ms: number;
  model_type: string;
  created_at: Date;
};

const ENCOUNTER_COLUMNS = `
  id, record_id, encounter_date, notes, created_at, deleted_at
`;

const DIAGNOSIS_COLUMNS = `
  id, encounter_id, description, created_at
`;

const TREATMENT_COLUMNS = `
  id, encounter_id, description, created_at
`;

const PRESCRIPTION_COLUMNS = `
  id, encounter_id, medication, dosage, instructions, created_at
`;

const ODONTOGRAM_COLUMNS = `
  id, patient_id, chart_data, updated_at
`;

const EVOLUTION_COLUMNS = `
  id, encounter_id, notes, created_at
`;

const TIMELINE_COLUMNS = `
  id, patient_id, event_type, reference_id, description, event_date
`;

const IMAGE_COLUMNS = `
  id, tenant_id, patient_id, encounter_id, image_name, mime_type, image_base64, created_at
`;

const AI_RESULT_COLUMNS = `
  id, image_id, encounter_id, finding, confidence, risk_level, recommendations, processing_ms, model_type, created_at
`;

const CREATE_ENCOUNTER_QUERY = `
  INSERT INTO clinical_encounters (record_id, encounter_date, notes, created_at, deleted_at)
  VALUES ($1, $2::timestamp, $3, NOW(), NULL)
  RETURNING ${ENCOUNTER_COLUMNS}
`;

const SELECT_ENCOUNTER_BY_ID_QUERY = `
  SELECT ${ENCOUNTER_COLUMNS}
  FROM clinical_encounters
  WHERE id = $1 AND deleted_at IS NULL
  LIMIT 1
`;

const CREATE_DIAGNOSIS_QUERY = `
  INSERT INTO diagnoses (encounter_id, description, created_at)
  VALUES ($1, $2, NOW())
  RETURNING ${DIAGNOSIS_COLUMNS}
`;

const CREATE_TREATMENT_QUERY = `
  INSERT INTO treatments (encounter_id, description, created_at)
  VALUES ($1, $2, NOW())
  RETURNING ${TREATMENT_COLUMNS}
`;

const CREATE_PRESCRIPTION_QUERY = `
  INSERT INTO prescriptions (encounter_id, medication, dosage, instructions, created_at)
  VALUES ($1, $2, $3, $4, NOW())
  RETURNING ${PRESCRIPTION_COLUMNS}
`;

const UPSERT_ODONTOGRAM_QUERY = `
  INSERT INTO odontograms (patient_id, chart_data, updated_at)
  VALUES ($1, $2::jsonb, NOW())
  ON CONFLICT (patient_id) DO UPDATE
  SET chart_data = EXCLUDED.chart_data, updated_at = NOW()
  RETURNING ${ODONTOGRAM_COLUMNS}
`;

const CREATE_EVOLUTION_QUERY = `
  INSERT INTO evolutions (encounter_id, notes, created_at)
  VALUES ($1, $2, NOW())
  RETURNING ${EVOLUTION_COLUMNS}
`;

const CREATE_TIMELINE_EVENT_QUERY = `
  INSERT INTO clinical_timeline (patient_id, event_type, reference_id, description, event_date)
  VALUES ($1, $2, $3, $4, NOW())
  RETURNING ${TIMELINE_COLUMNS}
`;

const SELECT_TIMELINE_BY_PATIENT_ID_QUERY = `
  SELECT ${TIMELINE_COLUMNS}
  FROM clinical_timeline
  WHERE patient_id = $1
  ORDER BY event_date DESC
`;

const SELECT_ENCOUNTER_BY_ID_AND_PATIENT_ID_QUERY = `
  SELECT ce.id, ce.record_id, ce.encounter_date, ce.notes, ce.created_at, ce.deleted_at
  FROM clinical_encounters ce
  INNER JOIN clinical_records cr ON cr.id = ce.record_id
  WHERE ce.id = $1
    AND cr.patient_id = $2
    AND ce.deleted_at IS NULL
    AND cr.deleted_at IS NULL
  LIMIT 1
`;

const CREATE_IMAGE_QUERY = `
  INSERT INTO images
    (tenant_id, patient_id, encounter_id, image_name, mime_type, image_base64, created_at)
  VALUES ($1, $2, $3, $4, $5, $6, NOW())
  RETURNING ${IMAGE_COLUMNS}
`;

const CREATE_AI_RESULT_QUERY = `
  INSERT INTO ai_results
    (image_id, encounter_id, finding, confidence, risk_level, recommendations, processing_ms, model_type, created_at)
  VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, NOW())
  RETURNING ${AI_RESULT_COLUMNS}
`;

const SELECT_AI_RESULTS_BY_PATIENT_ID_QUERY = `
  SELECT ar.id, ar.image_id, ar.encounter_id, ar.finding, ar.confidence, ar.risk_level,
         ar.recommendations, ar.processing_ms, ar.model_type, ar.created_at
  FROM ai_results ar
  INNER JOIN images i ON i.id = ar.image_id
  WHERE i.patient_id = $1
  ORDER BY ar.created_at DESC
`;

@Injectable()
export class ClinicalRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createEncounter(payload: {
    recordId: string;
    encounterDate: string;
    notes: string;
  }): Promise<EncounterEntity> {
    const result = await this.databaseService
      .getPool()
      .query<EncounterRow>(CREATE_ENCOUNTER_QUERY, [
        payload.recordId,
        payload.encounterDate,
        payload.notes,
      ]);
    return this.mapEncounter(result.rows[0]);
  }

  async findEncounterById(
    encounterId: string,
  ): Promise<EncounterEntity | null> {
    const result = await this.databaseService
      .getPool()
      .query<EncounterRow>(SELECT_ENCOUNTER_BY_ID_QUERY, [encounterId]);
    return result.rows[0] ? this.mapEncounter(result.rows[0]) : null;
  }

  async createDiagnosis(payload: {
    encounterId: string;
    description: string;
  }): Promise<DiagnosisEntity> {
    const result = await this.databaseService
      .getPool()
      .query<DiagnosisRow>(CREATE_DIAGNOSIS_QUERY, [
        payload.encounterId,
        payload.description,
      ]);
    return this.mapDiagnosis(result.rows[0]);
  }

  async createTreatment(payload: {
    encounterId: string;
    description: string;
  }): Promise<TreatmentEntity> {
    const result = await this.databaseService
      .getPool()
      .query<TreatmentRow>(CREATE_TREATMENT_QUERY, [
        payload.encounterId,
        payload.description,
      ]);
    return this.mapTreatment(result.rows[0]);
  }

  async createPrescription(payload: {
    encounterId: string;
    medication: string;
    dosage: string;
    instructions: string;
  }): Promise<PrescriptionEntity> {
    const result = await this.databaseService
      .getPool()
      .query<PrescriptionRow>(CREATE_PRESCRIPTION_QUERY, [
        payload.encounterId,
        payload.medication,
        payload.dosage,
        payload.instructions,
      ]);
    return this.mapPrescription(result.rows[0]);
  }

  async upsertOdontogram(
    patientId: string,
    chartData: Record<string, unknown>,
  ): Promise<OdontogramEntity> {
    const result = await this.databaseService
      .getPool()
      .query<OdontogramRow>(UPSERT_ODONTOGRAM_QUERY, [
        patientId,
        JSON.stringify(chartData),
      ]);
    return this.mapOdontogram(result.rows[0]);
  }

  async createEvolution(payload: {
    encounterId: string;
    notes: string;
  }): Promise<EvolutionEntity> {
    const result = await this.databaseService
      .getPool()
      .query<EvolutionRow>(CREATE_EVOLUTION_QUERY, [
        payload.encounterId,
        payload.notes,
      ]);
    return this.mapEvolution(result.rows[0]);
  }

  async createTimelineEvent(payload: {
    patientId: string;
    eventType: string;
    referenceId: string;
    description: string;
  }): Promise<ClinicalTimelineEntity> {
    const result = await this.databaseService
      .getPool()
      .query<TimelineRow>(CREATE_TIMELINE_EVENT_QUERY, [
        payload.patientId,
        payload.eventType,
        payload.referenceId,
        payload.description,
      ]);
    return this.mapTimeline(result.rows[0]);
  }

  async getTimelineByPatientId(
    patientId: string,
  ): Promise<ClinicalTimelineEntity[]> {
    const result = await this.databaseService
      .getPool()
      .query<TimelineRow>(SELECT_TIMELINE_BY_PATIENT_ID_QUERY, [patientId]);
    return result.rows.map((row) => this.mapTimeline(row));
  }

  async findEncounterByIdAndPatientId(
    encounterId: string,
    patientId: string,
  ): Promise<EncounterEntity | null> {
    const result = await this.databaseService
      .getPool()
      .query<EncounterRow>(SELECT_ENCOUNTER_BY_ID_AND_PATIENT_ID_QUERY, [
        encounterId,
        patientId,
      ]);
    return result.rows[0] ? this.mapEncounter(result.rows[0]) : null;
  }

  async createImage(payload: {
    tenantId: string;
    patientId: string;
    encounterId: string;
    imageName: string;
    mimeType: string;
    imageBase64: string;
  }): Promise<ImageEntity> {
    const result = await this.databaseService
      .getPool()
      .query<ImageRow>(CREATE_IMAGE_QUERY, [
        payload.tenantId,
        payload.patientId,
        payload.encounterId,
        payload.imageName,
        payload.mimeType,
        payload.imageBase64,
      ]);
    return this.mapImage(result.rows[0]);
  }

  async createAiResult(payload: {
    imageId: string;
    encounterId: string;
    finding: string;
    confidence: number;
    riskLevel: string;
    recommendations: string[];
    processingMs: number;
    modelType: string;
  }): Promise<AiResultEntity> {
    const result = await this.databaseService
      .getPool()
      .query<AiResultRow>(CREATE_AI_RESULT_QUERY, [
        payload.imageId,
        payload.encounterId,
        payload.finding,
        payload.confidence,
        payload.riskLevel,
        JSON.stringify(payload.recommendations),
        payload.processingMs,
        payload.modelType,
      ]);
    return this.mapAiResult(result.rows[0]);
  }

  async getAiResultsByPatientId(patientId: string): Promise<AiResultEntity[]> {
    const result = await this.databaseService
      .getPool()
      .query<AiResultRow>(SELECT_AI_RESULTS_BY_PATIENT_ID_QUERY, [patientId]);
    return result.rows.map((row) => this.mapAiResult(row));
  }

  private mapEncounter(row: EncounterRow): EncounterEntity {
    return {
      id: row.id,
      recordId: row.record_id,
      encounterDate: row.encounter_date,
      notes: row.notes,
      createdAt: row.created_at,
      deletedAt: row.deleted_at,
    };
  }

  private mapDiagnosis(row: DiagnosisRow): DiagnosisEntity {
    return {
      id: row.id,
      encounterId: row.encounter_id,
      description: row.description,
      createdAt: row.created_at,
    };
  }

  private mapTreatment(row: TreatmentRow): TreatmentEntity {
    return {
      id: row.id,
      encounterId: row.encounter_id,
      description: row.description,
      createdAt: row.created_at,
    };
  }

  private mapPrescription(row: PrescriptionRow): PrescriptionEntity {
    return {
      id: row.id,
      encounterId: row.encounter_id,
      medication: row.medication,
      dosage: row.dosage,
      instructions: row.instructions,
      createdAt: row.created_at,
    };
  }

  private mapOdontogram(row: OdontogramRow): OdontogramEntity {
    return {
      id: row.id,
      patientId: row.patient_id,
      chartData: row.chart_data,
      updatedAt: row.updated_at,
    };
  }

  private mapEvolution(row: EvolutionRow): EvolutionEntity {
    return {
      id: row.id,
      encounterId: row.encounter_id,
      notes: row.notes,
      createdAt: row.created_at,
    };
  }

  private mapTimeline(row: TimelineRow): ClinicalTimelineEntity {
    return {
      id: row.id,
      patientId: row.patient_id,
      eventType: row.event_type,
      referenceId: row.reference_id,
      description: row.description,
      eventDate: row.event_date,
    };
  }

  private mapImage(row: ImageRow): ImageEntity {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      patientId: row.patient_id,
      encounterId: row.encounter_id,
      imageName: row.image_name,
      mimeType: row.mime_type,
      imageBase64: row.image_base64,
      createdAt: row.created_at,
    };
  }

  private mapAiResult(row: AiResultRow): AiResultEntity {
    return {
      id: row.id,
      imageId: row.image_id,
      encounterId: row.encounter_id,
      finding: row.finding,
      confidence: Number(row.confidence),
      riskLevel: row.risk_level,
      recommendations: Array.isArray(row.recommendations)
        ? row.recommendations
        : [],
      processingMs: row.processing_ms,
      modelType: row.model_type,
      createdAt: row.created_at,
    };
  }
}
