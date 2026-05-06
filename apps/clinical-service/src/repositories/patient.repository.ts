/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- Infraestructura SQL con driver pg */
import { Injectable } from '@nestjs/common';
import { ClinicalRecordEntity } from '../domain/clinical-record.entity';
import { PatientEntity } from '../domain/patient.entity';
import { DatabaseService } from '../services/database.service';

type PatientRow = {
  id: string;
  tenant_id: string;
  name: string;
  document: string;
  birth_date: Date;
  created_at: Date;
  deleted_at: Date | null;
};

type ClinicalRecordRow = {
  id: string;
  patient_id: string;
  created_at: Date;
  deleted_at: Date | null;
};

const PATIENT_COLUMNS = `
  id, tenant_id, name, document, birth_date, created_at, deleted_at
`;

const CLINICAL_RECORD_COLUMNS = `
  id, patient_id, created_at, deleted_at
`;

const CREATE_PATIENT_QUERY = `
  INSERT INTO patients (tenant_id, name, document, birth_date, created_at, deleted_at)
  VALUES ($1, $2, $3, $4::date, NOW(), NULL)
  RETURNING ${PATIENT_COLUMNS}
`;

const SELECT_PATIENT_BY_ID_AND_TENANT_QUERY = `
  SELECT ${PATIENT_COLUMNS}
  FROM patients
  WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
  LIMIT 1
`;

const CREATE_CLINICAL_RECORD_QUERY = `
  INSERT INTO clinical_records (patient_id, created_at, deleted_at)
  VALUES ($1, NOW(), NULL)
  RETURNING ${CLINICAL_RECORD_COLUMNS}
`;

const SELECT_CLINICAL_RECORD_BY_PATIENT_ID_QUERY = `
  SELECT ${CLINICAL_RECORD_COLUMNS}
  FROM clinical_records
  WHERE patient_id = $1 AND deleted_at IS NULL
  LIMIT 1
`;

@Injectable()
export class PatientRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(payload: {
    tenantId: string;
    name: string;
    document: string;
    birthDate: string;
  }): Promise<PatientEntity> {
    const result = await this.databaseService
      .getPool()
      .query<PatientRow>(CREATE_PATIENT_QUERY, [
        payload.tenantId,
        payload.name,
        payload.document,
        payload.birthDate,
      ]);
    return this.mapPatient(result.rows[0]);
  }

  async findByIdAndTenant(
    patientId: string,
    tenantId: string,
  ): Promise<PatientEntity | null> {
    const result = await this.databaseService
      .getPool()
      .query<PatientRow>(SELECT_PATIENT_BY_ID_AND_TENANT_QUERY, [
        patientId,
        tenantId,
      ]);

    return result.rows[0] ? this.mapPatient(result.rows[0]) : null;
  }

  async createClinicalRecord(patientId: string): Promise<ClinicalRecordEntity> {
    const result = await this.databaseService
      .getPool()
      .query<ClinicalRecordRow>(CREATE_CLINICAL_RECORD_QUERY, [patientId]);
    return this.mapRecord(result.rows[0]);
  }

  async findClinicalRecordByPatientId(
    patientId: string,
  ): Promise<ClinicalRecordEntity | null> {
    const result = await this.databaseService
      .getPool()
      .query<ClinicalRecordRow>(SELECT_CLINICAL_RECORD_BY_PATIENT_ID_QUERY, [
        patientId,
      ]);
    return result.rows[0] ? this.mapRecord(result.rows[0]) : null;
  }

  private mapPatient(row: PatientRow): PatientEntity {
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

  private mapRecord(row: ClinicalRecordRow): ClinicalRecordEntity {
    return {
      id: row.id,
      patientId: row.patient_id,
      createdAt: row.created_at,
      deletedAt: row.deleted_at,
    };
  }
}
