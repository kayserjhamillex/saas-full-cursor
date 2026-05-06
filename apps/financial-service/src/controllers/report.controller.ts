import { Controller, Get, Query } from '@nestjs/common';
import { GetCashFlowQueryDto } from './dto/get-cash-flow-query.dto';
import { ReportService } from '../services/report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('cash-flow')
  getCashFlow(@Query('tenantId') tenantId: string | undefined) {
    const query = GetCashFlowQueryDto.from({ tenantId });
    return this.reportService.getCashFlow(query.tenantId);
  }
}
