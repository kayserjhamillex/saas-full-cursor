import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { GatewayClinicalTenantBodyDto } from './dto/gateway-clinical-tenant-body.dto';
import { GatewayClinicalTenantQueryDto } from './dto/gateway-clinical-tenant-query.dto';
import { GatewayAssignAssetDto } from './dto/gateway-assign-asset.dto';
import { GatewayCreateAssetDto } from './dto/gateway-create-asset.dto';
import { GatewayCreateEmployeeDto } from './dto/gateway-create-employee.dto';
import { GatewayCreateEvaluationDto } from './dto/gateway-create-evaluation.dto';
import { GatewayCreateFinancialAccountDto } from './dto/gateway-create-financial-account.dto';
import { GatewayCreateFinancialTransactionDto } from './dto/gateway-create-financial-transaction.dto';
import { GatewayCreatePatientDto } from './dto/gateway-create-patient.dto';
import { GatewayCreateProductDto } from './dto/gateway-create-product.dto';
import { GatewayCreateWarehouseDto } from './dto/gateway-create-warehouse.dto';
import { GatewayFinancialQueryDto } from './dto/gateway-financial-query.dto';
import { GatewayFileMetadataQueryDto } from './dto/gateway-file-metadata-query.dto';
import { GatewayGeneratePayrollDto } from './dto/gateway-generate-payroll.dto';
import { GatewayHrTenantBodyDto } from './dto/gateway-hr-tenant-body.dto';
import { GatewayInventoryQueryDto } from './dto/gateway-inventory-query.dto';
import { GatewayLoginDto } from './dto/gateway-login.dto';
import { GatewayRegisterAssetDepreciationDto } from './dto/gateway-register-asset-depreciation.dto';
import { GatewayRegisterAssetMovementDto } from './dto/gateway-register-asset-movement.dto';
import { GatewaySendEmailNotificationDto } from './dto/gateway-send-email-notification.dto';
import { GatewaySendWhatsappNotificationDto } from './dto/gateway-send-whatsapp-notification.dto';
import { GatewayStockMutationDto } from './dto/gateway-stock-mutation.dto';
import { GatewayTransferStockDto } from './dto/gateway-transfer-stock.dto';
import { GatewayUploadFileDto } from './dto/gateway-upload-file.dto';
import { ValidateTenantStatusRequestDto } from './dto/validate-tenant-status-request.dto';
import { GatewayRequestValidationService } from './shared/services/gateway-request-validation.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gatewayRequestValidationService: GatewayRequestValidationService,
  ) {}

  @Post('auth/login')
  login(
    @Body() body: { email?: string; password?: string; tenantId?: string },
  ) {
    return this.appService.forwardLogin(GatewayLoginDto.from(body));
  }

  @Get('core/tenants/:tenantId/status')
  validateProtectedTenantRoute(
    @Param('tenantId') tenantId: string,
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
    @Query('module') moduleName: string | undefined,
  ) {
    const request = ValidateTenantStatusRequestDto.from({
      tenantId,
      authorization,
      requestTenantId,
      moduleName,
    });

    return this.appService.validateAndForwardTenant(
      request.tenantId,
      request.authorization,
      request.requestTenantId,
      request.moduleName,
    );
  }

  @Post('clinical/patients')
  createPatient(
    @Body()
    body: {
      tenantId?: string;
      name?: string;
      document?: string;
      birthDate?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayCreatePatientDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );

    return this.appService.forwardClinicalRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'patients',
      method: 'POST',
      body,
    });
  }

  @Post('clinical/records/encounters')
  createEncounter(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      encounterDate?: string;
      notes?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayClinicalTenantBodyDto.from(body);
    return this.appService.forwardClinicalRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'records/encounters',
      method: 'POST',
      body,
    });
  }

  @Post('clinical/records/diagnoses')
  createDiagnosis(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      encounterId?: string;
      description?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayClinicalTenantBodyDto.from(body);
    return this.appService.forwardClinicalRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'records/diagnoses',
      method: 'POST',
      body,
    });
  }

  @Post('clinical/records/treatments')
  createTreatment(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      encounterId?: string;
      description?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayClinicalTenantBodyDto.from(body);
    return this.appService.forwardClinicalRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'records/treatments',
      method: 'POST',
      body,
    });
  }

  @Post('clinical/records/prescriptions')
  createPrescription(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      encounterId?: string;
      medication?: string;
      dosage?: string;
      instructions?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayClinicalTenantBodyDto.from(body);
    return this.appService.forwardClinicalRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'records/prescriptions',
      method: 'POST',
      body,
    });
  }

  @Post('clinical/records/evolutions')
  createEvolution(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      encounterId?: string;
      notes?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayClinicalTenantBodyDto.from(body);
    return this.appService.forwardClinicalRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'records/evolutions',
      method: 'POST',
      body,
    });
  }

  @Post('clinical/odontograms')
  updateOdontogram(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      chartData?: Record<string, unknown>;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayClinicalTenantBodyDto.from(body);
    return this.appService.forwardClinicalRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'odontograms',
      method: 'POST',
      body,
    });
  }

  @Get('clinical/records/timeline/:patientId')
  getClinicalTimeline(
    @Param('patientId') patientId: string,
    @Query('tenantId') tenantId: string | undefined,
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayClinicalTenantQueryDto.from({ tenantId });
    return this.appService.forwardClinicalRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: `records/timeline/${patientId}`,
      method: 'GET',
      query: { tenantId: request.tenantId },
    });
  }

  @Post('clinical/records/ai/process')
  processClinicalImage(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      encounterId?: string;
      imageName?: string;
      mimeType?: string;
      imageBase64?: string;
      modelType?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayClinicalTenantBodyDto.from(body);
    return this.appService.forwardClinicalRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'records/ai/process',
      method: 'POST',
      body,
    });
  }

  @Get('clinical/records/ai/results/:patientId')
  getClinicalAiResults(
    @Param('patientId') patientId: string,
    @Query('tenantId') tenantId: string | undefined,
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayClinicalTenantQueryDto.from({ tenantId });
    return this.appService.forwardClinicalRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: `records/ai/results/${patientId}`,
      method: 'GET',
      query: { tenantId: request.tenantId },
    });
  }

  @Post('inventory/products')
  createProduct(
    @Body()
    body: {
      tenantId?: string;
      categoryId?: string;
      subcategoryId?: string;
      sku?: string;
      name?: string;
      unit?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayCreateProductDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );

    return this.appService.forwardInventoryRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'products',
      method: 'POST',
      body,
    });
  }

  @Post('inventory/warehouses')
  createWarehouse(
    @Body() body: { tenantId?: string; name?: string },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayCreateWarehouseDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardInventoryRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'warehouses',
      method: 'POST',
      body,
    });
  }

  @Post('inventory/stock/entries')
  registerStockEntry(
    @Body()
    body: {
      tenantId?: string;
      productId?: string;
      warehouseId?: string;
      quantity?: number;
      reference?: string;
      notes?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayStockMutationDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardInventoryRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'stock/entries',
      method: 'POST',
      body,
    });
  }

  @Post('inventory/stock/exits')
  registerStockExit(
    @Body()
    body: {
      tenantId?: string;
      productId?: string;
      warehouseId?: string;
      quantity?: number;
      reference?: string;
      notes?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayStockMutationDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardInventoryRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'stock/exits',
      method: 'POST',
      body,
    });
  }

  @Post('inventory/stock/transfers')
  transferStock(
    @Body()
    body: {
      tenantId?: string;
      productId?: string;
      fromWarehouseId?: string;
      toWarehouseId?: string;
      quantity?: number;
      reference?: string;
      notes?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayTransferStockDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardInventoryRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'stock/transfers',
      method: 'POST',
      body,
    });
  }

  @Get('inventory/stock/:productId')
  getStock(
    @Param('productId') productId: string,
    @Query('tenantId') tenantId: string | undefined,
    @Query('warehouseId') warehouseId: string | undefined,
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayInventoryQueryDto.from({ tenantId });
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardInventoryRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: `stock/${productId}`,
      method: 'GET',
      query: { tenantId: request.tenantId, warehouseId },
    });
  }

  @Get('inventory/kardex/:productId')
  getKardex(
    @Param('productId') productId: string,
    @Query('tenantId') tenantId: string | undefined,
    @Query('warehouseId') warehouseId: string | undefined,
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayInventoryQueryDto.from({ tenantId });
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardInventoryRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: `kardex/${productId}`,
      method: 'GET',
      query: { tenantId: request.tenantId, warehouseId },
    });
  }

  @Post('hr/employees')
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
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayCreateEmployeeDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardHrRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'employees',
      method: 'POST',
      body,
    });
  }

  @Post('hr/attendance')
  registerAttendance(
    @Body()
    body: {
      tenantId?: string;
      employeeId?: string;
      checkInAt?: string;
      checkOutAt?: string;
      status?: string;
      notes?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayHrTenantBodyDto.from(body);
    return this.appService.forwardHrRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'attendance',
      method: 'POST',
      body,
    });
  }

  @Post('hr/evaluations')
  createEvaluation(
    @Body()
    body: {
      tenantId?: string;
      employeeId?: string;
      evaluatorName?: string;
      score?: number;
      comments?: string;
      evaluatedAt?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayCreateEvaluationDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardHrRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'evaluations',
      method: 'POST',
      body,
    });
  }

  @Post('hr/payroll')
  generatePayroll(
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
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayGeneratePayrollDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardHrRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'payroll',
      method: 'POST',
      body,
    });
  }

  @Post('hr/trainings')
  createTraining(
    @Body()
    body: {
      tenantId?: string;
      employeeId?: string;
      title?: string;
      provider?: string;
      status?: string;
      completedAt?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayHrTenantBodyDto.from(body);
    return this.appService.forwardHrRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'trainings',
      method: 'POST',
      body,
    });
  }

  @Post('financial/accounts')
  createFinancialAccount(
    @Body()
    body: {
      tenantId?: string;
      name?: string;
      accountType?: string;
      currency?: string;
      initialBalance?: number;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayCreateFinancialAccountDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardFinancialRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'accounts',
      method: 'POST',
      body,
    });
  }

  @Get('financial/accounts')
  listFinancialAccounts(
    @Query('tenantId') tenantId: string | undefined,
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayFinancialQueryDto.from({ tenantId });
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardFinancialRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'accounts',
      method: 'GET',
      query: { tenantId: request.tenantId },
    });
  }

  @Post('financial/transactions')
  createFinancialTransaction(
    @Body()
    body: {
      tenantId?: string;
      accountId?: string;
      transactionType?: 'income' | 'expense';
      amount?: number;
      sourceModule?: string;
      reference?: string;
      notes?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayCreateFinancialTransactionDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardFinancialRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'transactions',
      method: 'POST',
      body,
    });
  }

  @Get('financial/transactions')
  listFinancialTransactions(
    @Query('tenantId') tenantId: string | undefined,
    @Query('accountId') accountId: string | undefined,
    @Query('transactionType') transactionType: string | undefined,
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayFinancialQueryDto.from({ tenantId });
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardFinancialRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'transactions',
      method: 'GET',
      query: { tenantId: request.tenantId, accountId, transactionType },
    });
  }

  @Get('financial/reports/cash-flow')
  getCashFlowReport(
    @Query('tenantId') tenantId: string | undefined,
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayFinancialQueryDto.from({ tenantId });
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardFinancialRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'reports/cash-flow',
      method: 'GET',
      query: { tenantId: request.tenantId },
    });
  }

  @Post('assets/assets')
  createAsset(
    @Body()
    body: {
      tenantId?: string;
      categoryId?: string;
      code?: string;
      name?: string;
      description?: string;
      acquisitionDate?: string;
      acquisitionCost?: number;
      usefulLifeMonths?: number;
      currentValue?: number;
      status?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayCreateAssetDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardAssetsRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'assets',
      method: 'POST',
      body,
    });
  }

  @Post('assets/assignments')
  assignAsset(
    @Body()
    body: {
      tenantId?: string;
      assetId?: string;
      employeeId?: string;
      areaName?: string;
      notes?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayAssignAssetDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardAssetsRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'assignments',
      method: 'POST',
      body,
    });
  }

  @Post('assets/movements')
  registerAssetMovement(
    @Body()
    body: {
      tenantId?: string;
      assetId?: string;
      movementType?: string;
      fromLocation?: string;
      toLocation?: string;
      notes?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayRegisterAssetMovementDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardAssetsRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'movements',
      method: 'POST',
      body,
    });
  }

  @Post('assets/depreciation')
  registerAssetDepreciation(
    @Body()
    body: {
      tenantId?: string;
      assetId?: string;
      periodLabel?: string;
      amount?: number;
      method?: string;
      financialAccountId?: string;
      notes?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayRegisterAssetDepreciationDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardAssetsRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      path: 'depreciation',
      method: 'POST',
      body,
    });
  }

  @Post('notifications/email')
  sendEmailNotification(
    @Body()
    body: {
      tenantId?: string;
      to?: string;
      subject?: string;
      template?: string;
      variables?: Record<string, unknown>;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewaySendEmailNotificationDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardEmailRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      body,
    });
  }

  @Post('notifications/whatsapp')
  sendWhatsappNotification(
    @Body()
    body: {
      tenantId?: string;
      phoneNumber?: string;
      message?: string;
      eventType?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewaySendWhatsappNotificationDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardWhatsappRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      body,
    });
  }

  @Post('files/upload')
  uploadFile(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      encounterId?: string;
      sourceModule?: string;
      fileName?: string;
      mimeType?: string;
      fileBase64?: string;
    },
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayUploadFileDto.from(body);
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardFileUploadRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      body,
    });
  }

  @Get('files/:fileId')
  getFileMetadata(
    @Param('fileId') fileId: string,
    @Query('tenantId') tenantId: string | undefined,
    @Headers('authorization') authorization: string | undefined,
    @Headers('x-tenant-id') requestTenantId: string | undefined,
  ) {
    const request = GatewayFileMetadataQueryDto.from({ tenantId });
    this.gatewayRequestValidationService.ensureBearerAuthorization(
      authorization,
    );
    return this.appService.forwardFileReadRequest({
      tenantId: request.tenantId,
      authorization,
      requestTenantId,
      fileId,
    });
  }
}
