"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../services/database.service");
let ClinicalRepository = class ClinicalRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async createEncounter(payload) {
        const result = await this.databaseService.getPool().query(`
      INSERT INTO clinical_encounters (record_id, encounter_date, notes, created_at, deleted_at)
      VALUES ($1, $2::timestamp, $3, NOW(), NULL)
      RETURNING id, record_id, encounter_date, notes, created_at, deleted_at
      `, [payload.recordId, payload.encounterDate, payload.notes]);
        return this.mapEncounter(result.rows[0]);
    }
    async findEncounterById(encounterId) {
        const result = await this.databaseService.getPool().query(`
      SELECT id, record_id, encounter_date, notes, created_at, deleted_at
      FROM clinical_encounters
      WHERE id = $1 AND deleted_at IS NULL
      LIMIT 1
      `, [encounterId]);
        return result.rows[0] ? this.mapEncounter(result.rows[0]) : null;
    }
    async createDiagnosis(payload) {
        const result = await this.databaseService.getPool().query(`
      INSERT INTO diagnoses (encounter_id, description, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id, encounter_id, description, created_at
      `, [payload.encounterId, payload.description]);
        return {
            id: result.rows[0].id,
            encounterId: result.rows[0].encounter_id,
            description: result.rows[0].description,
            createdAt: result.rows[0].created_at,
        };
    }
    async createTreatment(payload) {
        const result = await this.databaseService.getPool().query(`
      INSERT INTO treatments (encounter_id, description, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id, encounter_id, description, created_at
      `, [payload.encounterId, payload.description]);
        return {
            id: result.rows[0].id,
            encounterId: result.rows[0].encounter_id,
            description: result.rows[0].description,
            createdAt: result.rows[0].created_at,
        };
    }
    async createPrescription(payload) {
        const result = await this.databaseService.getPool().query(`
      INSERT INTO prescriptions (encounter_id, medication, dosage, instructions, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, encounter_id, medication, dosage, instructions, created_at
      `, [payload.encounterId, payload.medication, payload.dosage, payload.instructions]);
        return {
            id: result.rows[0].id,
            encounterId: result.rows[0].encounter_id,
            medication: result.rows[0].medication,
            dosage: result.rows[0].dosage,
            instructions: result.rows[0].instructions,
            createdAt: result.rows[0].created_at,
        };
    }
    async upsertOdontogram(patientId, chartData) {
        const result = await this.databaseService.getPool().query(`
      INSERT INTO odontograms (patient_id, chart_data, updated_at)
      VALUES ($1, $2::jsonb, NOW())
      ON CONFLICT (patient_id) DO UPDATE
      SET chart_data = EXCLUDED.chart_data, updated_at = NOW()
      RETURNING id, patient_id, chart_data, updated_at
      `, [patientId, JSON.stringify(chartData)]);
        return {
            id: result.rows[0].id,
            patientId: result.rows[0].patient_id,
            chartData: result.rows[0].chart_data,
            updatedAt: result.rows[0].updated_at,
        };
    }
    async createEvolution(payload) {
        const result = await this.databaseService.getPool().query(`
      INSERT INTO evolutions (encounter_id, notes, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id, encounter_id, notes, created_at
      `, [payload.encounterId, payload.notes]);
        return {
            id: result.rows[0].id,
            encounterId: result.rows[0].encounter_id,
            notes: result.rows[0].notes,
            createdAt: result.rows[0].created_at,
        };
    }
    async createTimelineEvent(payload) {
        const result = await this.databaseService.getPool().query(`
      INSERT INTO clinical_timeline (patient_id, event_type, reference_id, description, event_date)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, patient_id, event_type, reference_id, description, event_date
      `, [payload.patientId, payload.eventType, payload.referenceId, payload.description]);
        return this.mapTimeline(result.rows[0]);
    }
    async getTimelineByPatientId(patientId) {
        const result = await this.databaseService.getPool().query(`
      SELECT id, patient_id, event_type, reference_id, description, event_date
      FROM clinical_timeline
      WHERE patient_id = $1
      ORDER BY event_date DESC
      `, [patientId]);
        return result.rows.map((row) => this.mapTimeline(row));
    }
    async findEncounterByIdAndPatientId(encounterId, patientId) {
        const result = await this.databaseService.getPool().query(`
      SELECT ce.id, ce.record_id, ce.encounter_date, ce.notes, ce.created_at, ce.deleted_at
      FROM clinical_encounters ce
      INNER JOIN clinical_records cr ON cr.id = ce.record_id
      WHERE ce.id = $1
        AND cr.patient_id = $2
        AND ce.deleted_at IS NULL
        AND cr.deleted_at IS NULL
      LIMIT 1
      `, [encounterId, patientId]);
        return result.rows[0] ? this.mapEncounter(result.rows[0]) : null;
    }
    async createImage(payload) {
        const result = await this.databaseService.getPool().query(`
      INSERT INTO images
        (tenant_id, patient_id, encounter_id, image_name, mime_type, image_base64, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id, tenant_id, patient_id, encounter_id, image_name, mime_type, image_base64, created_at
      `, [
            payload.tenantId,
            payload.patientId,
            payload.encounterId,
            payload.imageName,
            payload.mimeType,
            payload.imageBase64,
        ]);
        return this.mapImage(result.rows[0]);
    }
    async createAiResult(payload) {
        const result = await this.databaseService.getPool().query(`
      INSERT INTO ai_results
        (image_id, encounter_id, finding, confidence, risk_level, recommendations, processing_ms, model_type, created_at)
      VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, NOW())
      RETURNING id, image_id, encounter_id, finding, confidence, risk_level, recommendations, processing_ms, model_type, created_at
      `, [
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
    async getAiResultsByPatientId(patientId) {
        const result = await this.databaseService.getPool().query(`
      SELECT ar.id, ar.image_id, ar.encounter_id, ar.finding, ar.confidence, ar.risk_level,
             ar.recommendations, ar.processing_ms, ar.model_type, ar.created_at
      FROM ai_results ar
      INNER JOIN images i ON i.id = ar.image_id
      WHERE i.patient_id = $1
      ORDER BY ar.created_at DESC
      `, [patientId]);
        return result.rows.map((row) => this.mapAiResult(row));
    }
    mapEncounter(row) {
        return {
            id: row.id,
            recordId: row.record_id,
            encounterDate: row.encounter_date,
            notes: row.notes,
            createdAt: row.created_at,
            deletedAt: row.deleted_at,
        };
    }
    mapTimeline(row) {
        return {
            id: row.id,
            patientId: row.patient_id,
            eventType: row.event_type,
            referenceId: row.reference_id,
            description: row.description,
            eventDate: row.event_date,
        };
    }
    mapImage(row) {
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
    mapAiResult(row) {
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
};
exports.ClinicalRepository = ClinicalRepository;
exports.ClinicalRepository = ClinicalRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ClinicalRepository);
//# sourceMappingURL=clinical.repository.js.map