import { Body, Controller, Post } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeService } from '../services/employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  createEmployee(
    @Body()
    body: {
      tenantId?: string;
      fullName?: string;
      documentNumber?: string;
      email?: string;
      roleName?: string;
      position?: string;
      status?: string;
    },
  ) {
    return this.employeeService.createEmployee(CreateEmployeeDto.from(body));
  }
}
