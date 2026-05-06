import { BadRequestException } from '@nestjs/common';

export class CreateTrainingDto {
  constructor(
    public readonly tenantId: string,
    public readonly employeeId: string,
    public readonly title: string,
    public readonly provider: string,
    public readonly status: string | undefined,
    public readonly completedAt: string | undefined,
  ) {}

  static from(payload: {
    tenantId?: string;
    employeeId?: string;
    title?: string;
    provider?: string;
    status?: string;
    completedAt?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const employeeId = payload.employeeId?.trim();
    const title = payload.title?.trim();
    const provider = payload.provider?.trim();

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!employeeId) {
      throw new BadRequestException('employeeId es obligatorio');
    }
    if (!title) {
      throw new BadRequestException('title es obligatorio');
    }
    if (!provider) {
      throw new BadRequestException('provider es obligatorio');
    }

    return new CreateTrainingDto(
      tenantId,
      employeeId,
      title,
      provider,
      payload.status?.trim(),
      payload.completedAt?.trim(),
    );
  }
}
