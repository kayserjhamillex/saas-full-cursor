"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const clinical_controller_1 = require("./controllers/clinical.controller");
const odontogram_controller_1 = require("./controllers/odontogram.controller");
const patient_controller_1 = require("./controllers/patient.controller");
const clinical_repository_1 = require("./repositories/clinical.repository");
const patient_repository_1 = require("./repositories/patient.repository");
const clinical_service_1 = require("./services/clinical.service");
const ai_integration_service_1 = require("./services/ai-integration.service");
const database_service_1 = require("./services/database.service");
const diagnosis_service_1 = require("./services/diagnosis.service");
const patient_service_1 = require("./services/patient.service");
const treatment_service_1 = require("./services/treatment.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [
            app_controller_1.AppController,
            patient_controller_1.PatientController,
            clinical_controller_1.ClinicalController,
            odontogram_controller_1.OdontogramController,
        ],
        providers: [
            app_service_1.AppService,
            database_service_1.DatabaseService,
            patient_repository_1.PatientRepository,
            clinical_repository_1.ClinicalRepository,
            patient_service_1.PatientService,
            clinical_service_1.ClinicalService,
            ai_integration_service_1.AiIntegrationService,
            diagnosis_service_1.DiagnosisService,
            treatment_service_1.TreatmentService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map