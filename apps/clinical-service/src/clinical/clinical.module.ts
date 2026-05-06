import { Module } from '@nestjs/common';
import { ClinicalController } from '../controllers/clinical.controller';
import { OdontogramController } from '../controllers/odontogram.controller';
import { PatientController } from '../controllers/patient.controller';
import { InternalServiceTokenGuard } from '../guards/internal-service-token.guard';
import { ClinicalRepository } from '../repositories/clinical.repository';
import { PatientRepository } from '../repositories/patient.repository';
import { AiIntegrationService } from '../services/ai-integration.service';
import { ClinicalService } from '../services/clinical.service';
import { DatabaseService } from '../services/database.service';
import { DiagnosisService } from '../services/diagnosis.service';
import { PatientService } from '../services/patient.service';
import { TreatmentService } from '../services/treatment.service';

@Module({
  controllers: [PatientController, ClinicalController, OdontogramController],
  providers: [
    DatabaseService,
    PatientRepository,
    ClinicalRepository,
    PatientService,
    ClinicalService,
    AiIntegrationService,
    DiagnosisService,
    TreatmentService,
    InternalServiceTokenGuard,
  ],
})
export class ClinicalModule {}
