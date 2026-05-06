import { Body, Controller, Post } from '@nestjs/common';
import { GeneratePayrollDto } from './dto/generate-payroll.dto';
import { PayrollService } from '../services/payroll.service';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  generate(
    @Body()
    body: {
      tenantId?: string;
      employeeId?: string;
      periodLabel?: string;
      baseAmount?: number;
      bonusAmount?: number;
      deductionAmount?: number;
      status?: string;
    },
  ) {
    return this.payrollService.generatePayroll(GeneratePayrollDto.from(body));
  }
}
