import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ClinicalRepository } from '../repositories/clinical.repository';
import { PatientRepository } from '../repositories/patient.repository';

@Injectable()
export class PatientService {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly clinicalRepository: ClinicalRepository,
  ) {}

  async createPatient(payload: {
    tenantId?: string;
    name?: string;
    document?: string;
    birthDate?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const name = payload.name?.trim();
    const document = payload.document?.trim();
    const birthDate = payload.birthDate?.trim();

    if (!tenantId || !name || !document || !birthDate) {
      throw new BadRequestException(
        'tenantId, name, document y birthDate son obligatorios',
      );
    }

    const patient = await this.patientRepository.create({
      tenantId,
      name,
      document,
      birthDate,
    });

    const record = await this.patientRepository.createClinicalRecord(patient.id);
    await this.clinicalRepository.createTimelineEvent({
      patientId: patient.id,
      eventType: 'patient_created',
      referenceId: patient.id,
      description: `Paciente registrado: ${patient.name}`,
    });
    await this.clinicalRepository.createTimelineEvent({
      patientId: patient.id,
      eventType: 'clinical_record_created',
      referenceId: record.id,
      description: 'Historia clínica inicial creada',
    });

    return {
      patient,
      clinicalRecord: record,
      events: ['patient_created', 'clinical_record_created'],
    };
  }

  async getPatient(tenantId: string, patientId: string) {
    const patient = await this.patientRepository.findByIdAndTenant(patientId, tenantId);
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }
    return patient;
  }
}
