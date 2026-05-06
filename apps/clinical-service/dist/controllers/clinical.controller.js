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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalController = void 0;
const common_1 = require("@nestjs/common");
const ai_integration_service_1 = require("../services/ai-integration.service");
const clinical_service_1 = require("../services/clinical.service");
let ClinicalController = class ClinicalController {
    clinicalService;
    aiIntegrationService;
    constructor(clinicalService, aiIntegrationService) {
        this.clinicalService = clinicalService;
        this.aiIntegrationService = aiIntegrationService;
    }
    createEncounter(body) {
        return this.clinicalService.createEncounter(body);
    }
    registerDiagnosis(body) {
        return this.clinicalService.registerDiagnosis(body);
    }
    assignTreatment(body) {
        return this.clinicalService.assignTreatment(body);
    }
    createPrescription(body) {
        return this.clinicalService.createPrescription(body);
    }
    registerEvolution(body) {
        return this.clinicalService.registerEvolution(body);
    }
    getTimeline(patientId, tenantId) {
        return this.clinicalService.getTimeline(tenantId ?? '', patientId);
    }
    processImage(body) {
        return this.aiIntegrationService.processImage(body);
    }
    getAiResults(patientId, tenantId) {
        return this.aiIntegrationService.getResultsByPatient(tenantId, patientId);
    }
};
exports.ClinicalController = ClinicalController;
__decorate([
    (0, common_1.Post)('encounters'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClinicalController.prototype, "createEncounter", null);
__decorate([
    (0, common_1.Post)('diagnoses'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClinicalController.prototype, "registerDiagnosis", null);
__decorate([
    (0, common_1.Post)('treatments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClinicalController.prototype, "assignTreatment", null);
__decorate([
    (0, common_1.Post)('prescriptions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClinicalController.prototype, "createPrescription", null);
__decorate([
    (0, common_1.Post)('evolutions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClinicalController.prototype, "registerEvolution", null);
__decorate([
    (0, common_1.Get)('timeline/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClinicalController.prototype, "getTimeline", null);
__decorate([
    (0, common_1.Post)('ai/process'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClinicalController.prototype, "processImage", null);
__decorate([
    (0, common_1.Get)('ai/results/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClinicalController.prototype, "getAiResults", null);
exports.ClinicalController = ClinicalController = __decorate([
    (0, common_1.Controller)('records'),
    __metadata("design:paramtypes", [clinical_service_1.ClinicalService,
        ai_integration_service_1.AiIntegrationService])
], ClinicalController);
//# sourceMappingURL=clinical.controller.js.map