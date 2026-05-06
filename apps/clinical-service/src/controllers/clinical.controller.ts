import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { GetAiResultsQueryDto } from './dto/get-ai-results-query.dto';
import { GetTimelineQueryDto } from './dto/get-timeline-query.dto';
import { ProcessAiImageDto } from './dto/process-ai-image.dto';
import { RegisterClinicalNoteDto } from './dto/register-clinical-note.dto';
import { RegisterEvolutionDto } from './dto/register-evolution.dto';
import { AiIntegrationService } from '../services/ai-integration.service';
import { ClinicalService } from '../services/clinical.service';

@Controller('records')
export class ClinicalController {
  constructor(
    private readonly clinicalService: ClinicalService,
    private readonly aiIntegrationService: AiIntegrationService,
  ) {}

  @Post('encounters')
  createEncounter(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      encounterDate?: string;
      notes?: string;
    },
  ) {
    return this.clinicalService.createEncounter(CreateEncounterDto.from(body));
  }

  @Post('diagnoses')
  registerDiagnosis(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      encounterId?: string;
      description?: string;
    },
  ) {
    return this.clinicalService.registerDiagnosis(
      RegisterClinicalNoteDto.from(body),
    );
  }

  @Post('treatments')
  assignTreatment(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      encounterId?: string;
      description?: string;
    },
  ) {
    return this.clinicalService.assignTreatment(
      RegisterClinicalNoteDto.from(body),
    );
  }

  @Post('prescriptions')
  createPrescription(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      encounterId?: string;
      medication?: string;
      dosage?: string;
      instructions?: string;
    },
  ) {
    return this.clinicalService.createPrescription(
      CreatePrescriptionDto.from(body),
    );
  }

  @Post('evolutions')
  registerEvolution(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      encounterId?: string;
      notes?: string;
    },
  ) {
    return this.clinicalService.registerEvolution(
      RegisterEvolutionDto.from(body),
    );
  }

  @Get('timeline/:patientId')
  getTimeline(
    @Param('patientId') patientId: string,
    @Query('tenantId') tenantId: string | undefined,
  ) {
    const query = GetTimelineQueryDto.from({ patientId, tenantId });
    return this.clinicalService.getTimeline(query.tenantId, query.patientId);
  }

  @Post('ai/process')
  processImage(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      encounterId?: string;
      imageName?: string;
      mimeType?: string;
      imageBase64?: string;
      modelType?: string;
    },
  ) {
    return this.aiIntegrationService.processImage(ProcessAiImageDto.from(body));
  }

  @Get('ai/results/:patientId')
  getAiResults(
    @Param('patientId') patientId: string,
    @Query('tenantId') tenantId: string | undefined,
  ) {
    const query = GetAiResultsQueryDto.from({ patientId, tenantId });
    return this.aiIntegrationService.getResultsByPatient(
      query.tenantId,
      query.patientId,
    );
  }
}
