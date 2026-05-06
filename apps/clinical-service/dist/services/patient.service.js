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
exports.PatientService = void 0;
const common_1 = require("@nestjs/common");
const clinical_repository_1 = require("../repositories/clinical.repository");
const patient_repository_1 = require("../repositories/patient.repository");
let PatientService = class PatientService {
    patientRepository;
    clinicalRepository;
    constructor(patientRepository, clinicalRepository) {
        this.patientRepository = patientRepository;
        this.clinicalRepository = clinicalRepository;
    }
    async createPatient(payload) {
        const tenantId = payload.tenantId?.trim();
        const name = payload.name?.trim();
        const document = payload.document?.trim();
        const birthDate = payload.birthDate?.trim();
        if (!tenantId || !name || !document || !birthDate) {
            throw new common_1.BadRequestException('tenantId, name, document y birthDate son obligatorios');
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
    async getPatient(tenantId, patientId) {
        const patient = await this.patientRepository.findByIdAndTenant(patientId, tenantId);
        if (!patient) {
            throw new common_1.NotFoundException('Paciente no encontrado');
        }
        return patient;
    }
};
exports.PatientService = PatientService;
exports.PatientService = PatientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [patient_repository_1.PatientRepository,
        clinical_repository_1.ClinicalRepository])
], PatientService);
//# sourceMappingURL=patient.service.js.map