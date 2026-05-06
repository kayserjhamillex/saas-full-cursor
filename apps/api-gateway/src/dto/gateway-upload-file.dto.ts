import { BadRequestException } from '@nestjs/common';

export class GatewayUploadFileDto {
  constructor(
    public readonly tenantId: string,
    public readonly fileName: string,
    public readonly mimeType: string,
    public readonly fileBase64: string,
  ) {}

  static from(payload: {
    tenantId?: string;
    fileName?: string;
    mimeType?: string;
    fileBase64?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const fileName = payload.fileName?.trim();
    const mimeType = payload.mimeType?.trim();
    const fileBase64 = payload.fileBase64?.trim();
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!fileName) {
      throw new BadRequestException('fileName es obligatorio');
    }
    if (!mimeType) {
      throw new BadRequestException('mimeType es obligatorio');
    }
    if (!fileBase64) {
      throw new BadRequestException('fileBase64 es obligatorio');
    }
    return new GatewayUploadFileDto(tenantId, fileName, mimeType, fileBase64);
  }
}
