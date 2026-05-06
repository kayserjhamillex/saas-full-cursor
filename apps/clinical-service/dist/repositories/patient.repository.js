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
exports.PatientRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../services/database.service");
let PatientRepository = class PatientRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(payload) {
        const result = await this.databaseService.getPool().query(`
      INSERT INTO patients (tenant_id, name, document, birth_date, created_at, deleted_at)
      VALUES ($1, $2, $3, $4::date, NOW(), NULL)
      RETURNING id, tenant_id, name, document, birth_date, created_at, deleted_at
      `, [payload.tenantId, payload.name, payload.document, payload.birthDate]);
        return this.mapPatient(result.rows[0]);
    }
    async findByIdAndTenant(patientId, tenantId) {
        const result = await this.databaseService.getPool().query(`
      SELECT id, tenant_id, name, document, birth_date, created_at, deleted_at
      FROM patients
      WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
      LIMIT 1
      `, [patientId, tenantId]);
        return result.rows[0] ? this.mapPatient(result.rows[0]) : null;
    }
    async createClinicalRecord(patientId) {
        const result = await this.databaseService.getPool().query(`
      INSERT INTO clinical_records (patient_id, created_at, deleted_at)
      VALUES ($1, NOW(), NULL)
      RETURNING id, patient_id, created_at, deleted_at
      `, [patientId]);
        return this.mapRecord(result.rows[0]);
    }
    async findClinicalRecordByPatientId(patientId) {
        const result = await this.databaseService.getPool().query(`
      SELECT id, patient_id, created_at, deleted_at
      FROM clinical_records
      WHERE patient_id = $1 AND deleted_at IS NULL
      LIMIT 1
      `, [patientId]);
        return result.rows[0] ? this.mapRecord(result.rows[0]) : null;
    }
    mapPatient(row) {
        return {
            id: row.id,
            tenantId: row.tenant_id,
            name: row.name,
            document: row.document,
            birthDate: row.birth_date,
            createdAt: row.created_at,
            deletedAt: row.deleted_at,
        };
    }
    mapRecord(row) {
        return {
            id: row.id,
            patientId: row.patient_id,
            createdAt: row.created_at,
            deletedAt: row.deleted_at,
        };
    }
};
exports.PatientRepository = PatientRepository;
exports.PatientRepository = PatientRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], PatientRepository);
//# sourceMappingURL=patient.repository.js.map