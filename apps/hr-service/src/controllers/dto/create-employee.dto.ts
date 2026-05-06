import { BadRequestException } from '@nestjs/common';

export class CreateEmployeeDto {
  constructor(
    public readonly tenantId: string,
    public readonly fullName: string,
    public readonly documentNumber: string,
    public readonly email: string,
    public readonly roleName: string,
    public readonly position: string,
    public readonly status: string | undefined,
  ) {}

  static from(payload: {
    tenantId?: string;
    fullName?: string;
    documentNumber?: string;
    email?: string;
    roleName?: string;
    position?: string;
    status?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const fullName = payload.fullName?.trim();
    const documentNumber = payload.documentNumber?.trim();
    const email = payload.email?.trim();
    const roleName = payload.roleName?.trim();
    const position = payload.position?.trim();

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!fullName) {
      throw new BadRequestException('fullName es obligatorio');
    }
    if (!documentNumber) {
      throw new BadRequestException('documentNumber es obligatorio');
    }
    if (!email) {
      throw new BadRequestException('email es obligatorio');
    }
    if (!roleName) {
      throw new BadRequestException('roleName es obligatorio');
    }
    if (!position) {
      throw new BadRequestException('position es obligatorio');
    }

    return new CreateEmployeeDto(
      tenantId,
      fullName,
      documentNumber,
      email,
      roleName,
      position,
      payload.status?.trim(),
    );
  }
}
