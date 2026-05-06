import { BadRequestException } from '@nestjs/common';

export class CreatePatientDto {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly document: string,
    public readonly birthDate: string,
  ) {}

  static from(payload: {
    tenantId?: string;
    name?: string;
    document?: string;
    birthDate?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const name = payload.name?.trim();
    const document = payload.document?.trim();
    const birthDateRaw = payload.birthDate?.trim();

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!name) {
      throw new BadRequestException('name es obligatorio');
    }
    if (!document) {
      throw new BadRequestException('document es obligatorio');
    }
    if (!birthDateRaw) {
      throw new BadRequestException('birthDate es obligatorio');
    }
    const timestamp = Date.parse(birthDateRaw);
    if (Number.isNaN(timestamp)) {
      throw new BadRequestException('birthDate invalido');
    }

    return new CreatePatientDto(
      tenantId,
      name,
      document,
      new Date(timestamp).toISOString(),
    );
  }
}
