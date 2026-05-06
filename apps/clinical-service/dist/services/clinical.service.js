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
exports.ClinicalService = void 0;
const common_1 = require("@nestjs/common");
const clinical_repository_1 = require("../repositories/clinical.repository");
const patient_repository_1 = require("../repositories/patient.repository");
const diagnosis_service_1 = require("./diagnosis.service");
const treatment_service_1 = require("./treatment.service");
let ClinicalService = class ClinicalService {
    patientRepository;
    clinicalRepository;
    diagnosisService;
    treatmentService;
    constructor(patientRepository, clinicalRepository, diagnosisService, treatmentService) {
        this.patientRepository = patientRepository;
        this.clinicalRepository = clinicalRepository;
        this.diagnosisService = diagnosisService;
        this.treatmentService = treatmentService;
    }
    async createEncounter(payload) {
        const tenantId = payload.tenantId?.trim();
        const patientId = payload.patientId?.trim();
        const encounterDate = payload.encounterDate?.trim();
        const notes = payload.notes?.trim();
        if (!tenantId || !patientId || !encounterDate || !notes) {
            throw new common_1.BadRequestException('tenantId, patientId, encounterDate y notes son obligatorios');
        }
        const patient = await this.patientRepository.findByIdAndTenant(patientId, tenantId);
        if (!patient) {
            throw new common_1.NotFoundException('No se puede registrar consulta sin paciente');
        }
        const clinicalRecord = await this.patientRepository.findClinicalRecordByPatientId(patientId);
        if (!clinicalRecord) {
            throw new common_1.NotFoundException('El paciente no tiene historia clínica');
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
    async registerDiagnosis(payload) {
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
    async assignTreatment(payload) {
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
    async createPrescription(payload) {
        const patient = await this.validatePatientContext(payload.tenantId, payload.patientId);
        const encounterId = payload.encounterId?.trim();
        const medication = payload.medication?.trim();
        const dosage = payload.dosage?.trim();
        const instructions = payload.instructions?.trim();
        if (!encounterId || !medication || !dosage || !instructions) {
            throw new common_1.BadRequestException('encounterId, medication, dosage e instructions son obligatorios');
        }
        const encounter = await this.clinicalRepository.findEncounterById(encounterId);
        if (!encounter) {
            throw new common_1.NotFoundException('Consulta clínica no encontrada');
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
    async registerEvolution(payload) {
        const patient = await this.validatePatientContext(payload.tenantId, payload.patientId);
        const encounterId = payload.encounterId?.trim();
        const notes = payload.notes?.trim();
        if (!encounterId || !notes) {
            throw new common_1.BadRequestException('encounterId y notes son obligatorios');
        }
        const encounter = await this.clinicalRepository.findEncounterById(encounterId);
        if (!encounter) {
            throw new common_1.NotFoundException('Consulta clínica no encontrada');
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
    async updateOdontogram(payload) {
        const patient = await this.validatePatientContext(payload.tenantId, payload.patientId);
        const chartData = payload.chartData;
        if (!chartData || typeof chartData !== 'object') {
            throw new common_1.BadRequestException('chartData es obligatorio');
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
    async getTimeline(tenantId, patientId) {
        await this.validatePatientContext(tenantId, patientId);
        return this.clinicalRepository.getTimelineByPatientId(patientId);
    }
    async validatePatientContext(tenantId, patientId) {
        const cleanTenant = tenantId?.trim();
        const cleanPatient = patientId?.trim();
        if (!cleanTenant || !cleanPatient) {
            throw new common_1.BadRequestException('tenantId y patientId son obligatorios');
        }
        const patient = await this.patientRepository.findByIdAndTenant(cleanPatient, cleanTenant);
        if (!patient) {
            throw new common_1.NotFoundException('Paciente no encontrado');
        }
        return patient;
    }
};
exports.ClinicalService = ClinicalService;
exports.ClinicalService = ClinicalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [patient_repository_1.PatientRepository,
        clinical_repository_1.ClinicalRepository,
        diagnosis_service_1.DiagnosisService,
        treatment_service_1.TreatmentService])
], ClinicalService);
//# sourceMappingURL=clinical.service.js.map