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
exports.AiIntegrationService = void 0;
const common_1 = require("@nestjs/common");
const clinical_repository_1 = require("../repositories/clinical.repository");
const patient_repository_1 = require("../repositories/patient.repository");
let AiIntegrationService = class AiIntegrationService {
    patientRepository;
    clinicalRepository;
    aiServiceUrl = process.env.AI_SERVICE_URL ?? 'http://localhost:8000';
    constructor(patientRepository, clinicalRepository) {
        this.patientRepository = patientRepository;
        this.clinicalRepository = clinicalRepository;
    }
    async processImage(payload) {
        const tenantId = payload.tenantId?.trim();
        const patientId = payload.patientId?.trim();
        const encounterId = payload.encounterId?.trim();
        const imageName = payload.imageName?.trim();
        const mimeType = payload.mimeType?.trim();
        const imageBase64 = payload.imageBase64?.trim();
        const modelType = payload.modelType?.trim() || 'cnn';
        if (!tenantId || !patientId || !encounterId || !imageName || !mimeType || !imageBase64) {
            throw new common_1.BadRequestException('tenantId, patientId, encounterId, imageName, mimeType e imageBase64 son obligatorios');
        }
        const patient = await this.patientRepository.findByIdAndTenant(patientId, tenantId);
        if (!patient) {
            throw new common_1.NotFoundException('Paciente no encontrado');
        }
        const encounter = await this.clinicalRepository.findEncounterByIdAndPatientId(encounterId, patientId);
        if (!encounter) {
            throw new common_1.NotFoundException('Consulta clínica no encontrada para el paciente');
        }
        const image = await this.clinicalRepository.createImage({
            tenantId,
            patientId,
            encounterId,
            imageName,
            mimeType,
            imageBase64,
        });
        await this.clinicalRepository.createTimelineEvent({
            patientId,
            eventType: 'image_uploaded',
            referenceId: image.id,
            description: `Imagen clinica cargada: ${imageName}`,
        });
        const aiResponse = await this.callAiService({
            tenantId,
            patientId,
            encounterId,
            imageName,
            mimeType,
            imageBase64,
            modelType,
        });
        const aiResult = await this.clinicalRepository.createAiResult({
            imageId: image.id,
            encounterId,
            finding: aiResponse.result?.finding ?? 'sin_hallazgo_relevante',
            confidence: Number(aiResponse.result?.confidence ?? 0),
            riskLevel: aiResponse.result?.riskLevel ?? 'low',
            recommendations: aiResponse.result?.recommendations ?? [],
            processingMs: Number(aiResponse.result?.processingMs ?? 0),
            modelType,
        });
        await this.clinicalRepository.createTimelineEvent({
            patientId,
            eventType: 'image_processed',
            referenceId: image.id,
            description: 'Imagen procesada por IA',
        });
        await this.clinicalRepository.createTimelineEvent({
            patientId,
            eventType: 'ai_result_generated',
            referenceId: aiResult.id,
            description: `Resultado IA generado: ${aiResult.finding}`,
        });
        return { image, aiResult };
    }
    async getResultsByPatient(tenantId, patientId) {
        const cleanTenant = tenantId?.trim();
        const cleanPatient = patientId?.trim();
        if (!cleanTenant || !cleanPatient) {
            throw new common_1.BadRequestException('tenantId y patientId son obligatorios');
        }
        const patient = await this.patientRepository.findByIdAndTenant(cleanPatient, cleanTenant);
        if (!patient) {
            throw new common_1.NotFoundException('Paciente no encontrado');
        }
        return this.clinicalRepository.getAiResultsByPatientId(cleanPatient);
    }
    async callAiService(payload) {
        try {
            const response = await fetch(`${this.aiServiceUrl}/ai/predictions/process`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const body = (await response.json());
            if (!response.ok) {
                throw new common_1.InternalServerErrorException('No se pudo procesar la imagen en ai-service');
            }
            return body;
        }
        catch {
            throw new common_1.InternalServerErrorException('Error de comunicacion con ai-service');
        }
    }
};
exports.AiIntegrationService = AiIntegrationService;
exports.AiIntegrationService = AiIntegrationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [patient_repository_1.PatientRepository,
        clinical_repository_1.ClinicalRepository])
], AiIntegrationService);
//# sourceMappingURL=ai-integration.service.js.map