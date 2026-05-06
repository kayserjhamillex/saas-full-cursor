import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ClinicalRepository } from '../repositories/clinical.repository';
import { PatientRepository } from '../repositories/patient.repository';
import { DiagnosisService } from './diagnosis.service';
import { TreatmentService } from './treatment.service';

@Injectable()
export class ClinicalService {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly clinicalRepository: ClinicalRepository,
    private readonly diagnosisService: DiagnosisService,
    private readonly treatmentService: TreatmentService,
  ) {}

  async createEncounter(payload: {
    tenantId?: string;
    patientId?: string;
    encounterDate?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const patientId = payload.patientId?.trim();
    const encounterDate = payload.encounterDate?.trim();
    const notes = payload.notes?.trim();

    if (!tenantId || !patientId || !encounterDate || !notes) {
      throw new BadRequestException(
        'tenantId, patientId, encounterDate y notes son obligatorios',
      );
    }

    const patient = await this.patientRepository.findByIdAndTenant(patientId, tenantId);
    if (!patient) {
      throw new NotFoundException('No se puede registrar consulta sin paciente');
    }

    const clinicalRecord =
      await this.patientRepository.findClinicalRecordByPatientId(patientId);
    if (!clinicalRecord) {
      throw new NotFoundException('El paciente no tiene historia clínica');
    }

    const encounter = await this.clinicalRepository.createEncounter({
      recordId: clinicalRecord.id,
      encounterDate,
      notes,
    });

    await this.clinicalRepository.createTimelineEvent({
      patientId,
      eventType: 'encounter_created',
      referenceId: encounter.id,
      description: 'Consulta clínica registrada',
    });

    return {
      encounter,
      event: 'encounter_created',
    };
  }

  async registerDiagnosis(payload: {
    tenantId?: string;
    patientId?: string;
    encounterId?: string;
    description?: string;
  }) {
    const patient = await this.validatePatientContext(payload.tenantId, payload.patientId);
    const diagnosis = await this.diagnosisService.registerDiagnosis(payload);

    await this.clinicalRepository.createTimelineEvent({
      patientId: patient.id,
      eventType: 'diagnosis_registered',
      referenceId: diagnosis.id,
      description: 'Diagnóstico registrado en consulta',
    });

    return { diagnosis, event: 'diagnosis_registered' };
  }

  async assignTreatment(payload: {
    tenantId?: string;
    patientId?: string;
    encounterId?: string;
    description?: string;
  }) {
    const patient = await this.validatePatientContext(payload.tenantId, payload.patientId);
    const treatment = await this.treatmentService.assignTreatment(payload);

    await this.clinicalRepository.createTimelineEvent({
      patientId: patient.id,
      eventType: 'treatment_assigned',
      referenceId: treatment.id,
      description: 'Tratamiento asignado al paciente',
    });

    return { treatment, event: 'treatment_assigned' };
  }

  async createPrescription(payload: {
    tenantId?: string;
    patientId?: string;
    encounterId?: string;
    medication?: string;
    dosage?: string;
    instructions?: string;
  }) {
    const patient = await this.validatePatientContext(payload.tenantId, payload.patientId);
    const encounterId = payload.encounterId?.trim();
    const medication = payload.medication?.trim();
    const dosage = payload.dosage?.trim();
    const instructions = payload.instructions?.trim();
    if (!encounterId || !medication || !dosage || !instructions) {
      throw new BadRequestException(
        'encounterId, medication, dosage e instructions son obligatorios',
      );
    }

    const encounter = await this.clinicalRepository.findEncounterById(encounterId);
    if (!encounter) {
      throw new NotFoundException('Consulta clínica no encontrada');
    }

    const prescription = await this.clinicalRepository.createPrescription({
      encounterId,
      medication,
      dosage,
      instructions,
    });

    await this.clinicalRepository.createTimelineEvent({
      patientId: patient.id,
      eventType: 'prescription_created',
      referenceId: prescription.id,
      description: `Receta emitida: ${medication}`,
    });

    return { prescription, event: 'prescription_created' };
  }

  async registerEvolution(payload: {
    tenantId?: string;
    patientId?: string;
    encounterId?: string;
    notes?: string;
  }) {
    const patient = await this.validatePatientContext(payload.tenantId, payload.patientId);
    const encounterId = payload.encounterId?.trim();
    const notes = payload.notes?.trim();
    if (!encounterId || !notes) {
      throw new BadRequestException('encounterId y notes son obligatorios');
    }

    const encounter = await this.clinicalRepository.findEncounterById(encounterId);
    if (!encounter) {
      throw new NotFoundException('Consulta clínica no encontrada');
    }

    const evolution = await this.clinicalRepository.createEvolution({ encounterId, notes });
    await this.clinicalRepository.createTimelineEvent({
      patientId: patient.id,
      eventType: 'evolution_registered',
      referenceId: evolution.id,
      description: 'Evolución clínica registrada',
    });

    return { evolution, event: 'evolution_registered' };
  }

  async updateOdontogram(payload: {
    tenantId?: string;
    patientId?: string;
    chartData?: Record<string, unknown>;
  }) {
    const patient = await this.validatePatientContext(payload.tenantId, payload.patientId);
    const chartData = payload.chartData;
    if (!chartData || typeof chartData !== 'object') {
      throw new BadRequestException('chartData es obligatorio');
    }

    const odontogram = await this.clinicalRepository.upsertOdontogram(patient.id, chartData);
    await this.clinicalRepository.createTimelineEvent({
      patientId: patient.id,
      eventType: 'odontogram_updated',
      referenceId: odontogram.id,
      description: 'Odontograma actualizado',
    });
    return odontogram;
  }

  async getTimeline(tenantId: string, patientId: string) {
    await this.validatePatientContext(tenantId, patientId);
    return this.clinicalRepository.getTimelineByPatientId(patientId);
  }

  private async validatePatientContext(tenantId?: string, patientId?: string) {
    const cleanTenant = tenantId?.trim();
    const cleanPatient = patientId?.trim();
    if (!cleanTenant || !cleanPatient) {
      throw new BadRequestException('tenantId y patientId son obligatorios');
    }

    const patient = await this.patientRepository.findByIdAndTenant(
      cleanPatient,
      cleanTenant,
    );
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }
    return patient;
  }
}
