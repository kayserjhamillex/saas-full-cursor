import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClinicalRepository } from '../repositories/clinical.repository';
import { PatientRepository } from '../repositories/patient.repository';

type AiServiceResponse = {
  result?: {
    finding?: string;
    confidence?: number;
    riskLevel?: string;
    recommendations?: string[];
    processingMs?: number;
  };
};

@Injectable()
export class AiIntegrationService {
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL ?? 'http://localhost:8000';

  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly clinicalRepository: ClinicalRepository,
  ) {}

  async processImage(payload: {
    tenantId?: string;
    patientId?: string;
    encounterId?: string;
    imageName?: string;
    mimeType?: string;
    imageBase64?: string;
    modelType?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const patientId = payload.patientId?.trim();
    const encounterId = payload.encounterId?.trim();
    const imageName = payload.imageName?.trim();
    const mimeType = payload.mimeType?.trim();
    const imageBase64 = payload.imageBase64?.trim();
    const modelType = payload.modelType?.trim() || 'cnn';

    if (!tenantId || !patientId || !encounterId || !imageName || !mimeType || !imageBase64) {
      throw new BadRequestException(
        'tenantId, patientId, encounterId, imageName, mimeType e imageBase64 son obligatorios',
      );
    }

    const patient = await this.patientRepository.findByIdAndTenant(patientId, tenantId);
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const encounter = await this.clinicalRepository.findEncounterByIdAndPatientId(
      encounterId,
      patientId,
    );
    if (!encounter) {
      throw new NotFoundException('Consulta clínica no encontrada para el paciente');
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

  async getResultsByPatient(tenantId?: string, patientId?: string) {
    const cleanTenant = tenantId?.trim();
    const cleanPatient = patientId?.trim();
    if (!cleanTenant || !cleanPatient) {
      throw new BadRequestException('tenantId y patientId son obligatorios');
    }

    const patient = await this.patientRepository.findByIdAndTenant(cleanPatient, cleanTenant);
    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return this.clinicalRepository.getAiResultsByPatientId(cleanPatient);
  }

  private async callAiService(payload: {
    tenantId: string;
    patientId: string;
    encounterId: string;
    imageName: string;
    mimeType: string;
    imageBase64: string;
    modelType: string;
  }): Promise<AiServiceResponse> {
    try {
      const response = await fetch(`${this.aiServiceUrl}/ai/predictions/process`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as AiServiceResponse;
      if (!response.ok) {
        throw new InternalServerErrorException('No se pudo procesar la imagen en ai-service');
      }
      return body;
    } catch {
      throw new InternalServerErrorException('Error de comunicacion con ai-service');
    }
  }
}
