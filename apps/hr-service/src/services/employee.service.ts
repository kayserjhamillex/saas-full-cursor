import { BadRequestException, Injectable } from '@nestjs/common';
import { HrRepository } from '../repositories/hr.repository';

@Injectable()
export class EmployeeService {
  constructor(private readonly hrRepository: HrRepository) {}

  async createEmployee(payload: {
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
    const status = payload.status?.trim() ?? 'active';

    if (!tenantId || !fullName || !documentNumber || !email || !roleName || !position) {
      throw new BadRequestException(
        'tenantId, fullName, documentNumber, email, roleName y position son obligatorios',
      );
    }

    const employee = await this.hrRepository.createEmployee({
      tenantId,
      fullName,
      documentNumber,
      email,
      roleName,
      position,
      status,
    });

    return {
      employee,
      event: 'employee_created',
    };
  }
}
