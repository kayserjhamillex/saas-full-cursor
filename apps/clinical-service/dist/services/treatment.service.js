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
exports.TreatmentService = void 0;
const common_1 = require("@nestjs/common");
const clinical_repository_1 = require("../repositories/clinical.repository");
let TreatmentService = class TreatmentService {
    clinicalRepository;
    constructor(clinicalRepository) {
        this.clinicalRepository = clinicalRepository;
    }
    async assignTreatment(payload) {
        const encounterId = payload.encounterId?.trim();
        const description = payload.description?.trim();
        if (!encounterId || !description) {
            throw new common_1.BadRequestException('encounterId y description son obligatorios');
        }
        const encounter = await this.clinicalRepository.findEncounterById(encounterId);
        if (!encounter) {
            throw new common_1.NotFoundException('Consulta clínica no encontrada');
        }
        return this.clinicalRepository.createTreatment({
            encounterId,
            description,
        });
    }
};
exports.TreatmentService = TreatmentService;
exports.TreatmentService = TreatmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clinical_repository_1.ClinicalRepository])
], TreatmentService);
//# sourceMappingURL=treatment.service.js.map