import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InternalServiceTokenGuard } from '../guards/internal-service-token.guard';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { GetTenantParamDto } from './dto/get-tenant-param.dto';
import { ValidateTenantAccessDto } from './dto/validate-tenant-access.dto';
import { SaaSValidationService } from '../services/saas-validation.service';
import { TenantService } from '../services/tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly saasValidationService: SaaSValidationService,
  ) {}

  @Post()
  createTenant(@Body() body: { name?: string }) {
    const dto = CreateTenantDto.from(body);
    return this.tenantService.createTenant(dto);
  }

  @Get(':tenantId')
  getTenant(@Param('tenantId') tenantId: string) {
    const params = GetTenantParamDto.from({ tenantId });
    return this.tenantService.getTenantById(params.tenantId);
  }

  @Get('internal/:tenantId/validate')
  @UseGuards(InternalServiceTokenGuard)
  validateTenantAccess(
    @Param('tenantId') tenantId: string,
    @Query('module') moduleName?: string,
  ) {
    const query = ValidateTenantAccessDto.from({ tenantId, moduleName });
    return this.saasValidationService.validateTenantAccess(
      query.tenantId,
      query.moduleName,
    );
  }
}
