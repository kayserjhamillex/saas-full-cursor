import { BadRequestException } from '@nestjs/common';

export class ProcessAiImageDto {
  constructor(
    public readonly tenantId: string,
    public readonly patientId: string,
    public readonly encounterId: string,
    public readonly imageName: string,
    public readonly mimeType: string,
    public readonly imageBase64: string,
    public readonly modelType: string | undefined,
  ) {}

  static from(payload: {
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

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!patientId) {
      throw new BadRequestException('patientId es obligatorio');
    }
    if (!encounterId) {
      throw new BadRequestException('encounterId es obligatorio');
    }
    if (!imageName) {
      throw new BadRequestException('imageName es obligatorio');
    }
    if (!mimeType) {
      throw new BadRequestException('mimeType es obligatorio');
    }
    if (!imageBase64) {
      throw new BadRequestException('imageBase64 es obligatorio');
    }

    return new ProcessAiImageDto(
      tenantId,
      patientId,
      encounterId,
      imageName,
      mimeType,
      imageBase64,
      payload.modelType?.trim(),
    );
  }
}
