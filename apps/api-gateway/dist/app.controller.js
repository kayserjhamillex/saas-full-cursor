"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    login(body) {
        return this.appService.forwardLogin(body);
    }
    validateProtectedTenantRoute(tenantId, authorization, requestTenantId, moduleName) {
        return this.appService.validateAndForwardTenant(tenantId, authorization, requestTenantId, moduleName);
    }
    createPatient(body, authorization, requestTenantId) {
        return this.appService.forwardClinicalRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'patients',
            method: 'POST',
            body,
        });
    }
    createEncounter(body, authorization, requestTenantId) {
        return this.appService.forwardClinicalRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'records/encounters',
            method: 'POST',
            body,
        });
    }
    createDiagnosis(body, authorization, requestTenantId) {
        return this.appService.forwardClinicalRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'records/diagnoses',
            method: 'POST',
            body,
        });
    }
    createTreatment(body, authorization, requestTenantId) {
        return this.appService.forwardClinicalRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'records/treatments',
            method: 'POST',
            body,
        });
    }
    createPrescription(body, authorization, requestTenantId) {
        return this.appService.forwardClinicalRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'records/prescriptions',
            method: 'POST',
            body,
        });
    }
    createEvolution(body, authorization, requestTenantId) {
        return this.appService.forwardClinicalRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'records/evolutions',
            method: 'POST',
            body,
        });
    }
    updateOdontogram(body, authorization, requestTenantId) {
        return this.appService.forwardClinicalRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'odontograms',
            method: 'POST',
            body,
        });
    }
    getClinicalTimeline(patientId, tenantId, authorization, requestTenantId) {
        return this.appService.forwardClinicalRequest({
            tenantId: tenantId ?? '',
            authorization,
            requestTenantId,
            path: `records/timeline/${patientId}`,
            method: 'GET',
            query: { tenantId },
        });
    }
    processClinicalImage(body, authorization, requestTenantId) {
        return this.appService.forwardClinicalRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'records/ai/process',
            method: 'POST',
            body,
        });
    }
    getClinicalAiResults(patientId, tenantId, authorization, requestTenantId) {
        return this.appService.forwardClinicalRequest({
            tenantId: tenantId ?? '',
            authorization,
            requestTenantId,
            path: `records/ai/results/${patientId}`,
            method: 'GET',
            query: { tenantId },
        });
    }
    createProduct(body, authorization, requestTenantId) {
        return this.appService.forwardInventoryRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'products',
            method: 'POST',
            body,
        });
    }
    createWarehouse(body, authorization, requestTenantId) {
        return this.appService.forwardInventoryRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'warehouses',
            method: 'POST',
            body,
        });
    }
    registerStockEntry(body, authorization, requestTenantId) {
        return this.appService.forwardInventoryRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'stock/entries',
            method: 'POST',
            body,
        });
    }
    registerStockExit(body, authorization, requestTenantId) {
        return this.appService.forwardInventoryRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'stock/exits',
            method: 'POST',
            body,
        });
    }
    transferStock(body, authorization, requestTenantId) {
        return this.appService.forwardInventoryRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'stock/transfers',
            method: 'POST',
            body,
        });
    }
    getStock(productId, tenantId, warehouseId, authorization, requestTenantId) {
        return this.appService.forwardInventoryRequest({
            tenantId: tenantId ?? '',
            authorization,
            requestTenantId,
            path: `stock/${productId}`,
            method: 'GET',
            query: { tenantId, warehouseId },
        });
    }
    getKardex(productId, tenantId, warehouseId, authorization, requestTenantId) {
        return this.appService.forwardInventoryRequest({
            tenantId: tenantId ?? '',
            authorization,
            requestTenantId,
            path: `kardex/${productId}`,
            method: 'GET',
            query: { tenantId, warehouseId },
        });
    }
    createEmployee(body, authorization, requestTenantId) {
        return this.appService.forwardHrRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'employees',
            method: 'POST',
            body,
        });
    }
    registerAttendance(body, authorization, requestTenantId) {
        return this.appService.forwardHrRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'attendance',
            method: 'POST',
            body,
        });
    }
    createEvaluation(body, authorization, requestTenantId) {
        return this.appService.forwardHrRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'evaluations',
            method: 'POST',
            body,
        });
    }
    generatePayroll(body, authorization, requestTenantId) {
        return this.appService.forwardHrRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'payroll',
            method: 'POST',
            body,
        });
    }
    createTraining(body, authorization, requestTenantId) {
        return this.appService.forwardHrRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'trainings',
            method: 'POST',
            body,
        });
    }
    createFinancialAccount(body, authorization, requestTenantId) {
        return this.appService.forwardFinancialRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'accounts',
            method: 'POST',
            body,
        });
    }
    listFinancialAccounts(tenantId, authorization, requestTenantId) {
        return this.appService.forwardFinancialRequest({
            tenantId: tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'accounts',
            method: 'GET',
            query: { tenantId },
        });
    }
    createFinancialTransaction(body, authorization, requestTenantId) {
        return this.appService.forwardFinancialRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'transactions',
            method: 'POST',
            body,
        });
    }
    listFinancialTransactions(tenantId, accountId, transactionType, authorization, requestTenantId) {
        return this.appService.forwardFinancialRequest({
            tenantId: tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'transactions',
            method: 'GET',
            query: { tenantId, accountId, transactionType },
        });
    }
    getCashFlowReport(tenantId, authorization, requestTenantId) {
        return this.appService.forwardFinancialRequest({
            tenantId: tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'reports/cash-flow',
            method: 'GET',
            query: { tenantId },
        });
    }
    createAsset(body, authorization, requestTenantId) {
        return this.appService.forwardAssetsRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'assets',
            method: 'POST',
            body,
        });
    }
    assignAsset(body, authorization, requestTenantId) {
        return this.appService.forwardAssetsRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'assignments',
            method: 'POST',
            body,
        });
    }
    registerAssetMovement(body, authorization, requestTenantId) {
        return this.appService.forwardAssetsRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'movements',
            method: 'POST',
            body,
        });
    }
    registerAssetDepreciation(body, authorization, requestTenantId) {
        return this.appService.forwardAssetsRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            path: 'depreciation',
            method: 'POST',
            body,
        });
    }
    sendEmailNotification(body, authorization, requestTenantId) {
        return this.appService.forwardEmailRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            body,
        });
    }
    sendWhatsappNotification(body, authorization, requestTenantId) {
        return this.appService.forwardWhatsappRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            body,
        });
    }
    uploadFile(body, authorization, requestTenantId) {
        return this.appService.forwardFileUploadRequest({
            tenantId: body.tenantId ?? '',
            authorization,
            requestTenantId,
            body,
        });
    }
    getFileMetadata(fileId, tenantId, authorization, requestTenantId) {
        return this.appService.forwardFileReadRequest({
            tenantId: tenantId ?? '',
            authorization,
            requestTenantId,
            fileId,
        });
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('auth/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('core/tenants/:tenantId/status'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __param(3, (0, common_1.Query)('module')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "validateProtectedTenantRoute", null);
__decorate([
    (0, common_1.Post)('clinical/patients'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createPatient", null);
__decorate([
    (0, common_1.Post)('clinical/records/encounters'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createEncounter", null);
__decorate([
    (0, common_1.Post)('clinical/records/diagnoses'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createDiagnosis", null);
__decorate([
    (0, common_1.Post)('clinical/records/treatments'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createTreatment", null);
__decorate([
    (0, common_1.Post)('clinical/records/prescriptions'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createPrescription", null);
__decorate([
    (0, common_1.Post)('clinical/records/evolutions'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createEvolution", null);
__decorate([
    (0, common_1.Post)('clinical/odontograms'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "updateOdontogram", null);
__decorate([
    (0, common_1.Get)('clinical/records/timeline/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('tenantId')),
    __param(2, (0, common_1.Headers)('authorization')),
    __param(3, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getClinicalTimeline", null);
__decorate([
    (0, common_1.Post)('clinical/records/ai/process'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "processClinicalImage", null);
__decorate([
    (0, common_1.Get)('clinical/records/ai/results/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('tenantId')),
    __param(2, (0, common_1.Headers)('authorization')),
    __param(3, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getClinicalAiResults", null);
__decorate([
    (0, common_1.Post)('inventory/products'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Post)('inventory/warehouses'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createWarehouse", null);
__decorate([
    (0, common_1.Post)('inventory/stock/entries'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "registerStockEntry", null);
__decorate([
    (0, common_1.Post)('inventory/stock/exits'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "registerStockExit", null);
__decorate([
    (0, common_1.Post)('inventory/stock/transfers'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "transferStock", null);
__decorate([
    (0, common_1.Get)('inventory/stock/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Query)('tenantId')),
    __param(2, (0, common_1.Query)('warehouseId')),
    __param(3, (0, common_1.Headers)('authorization')),
    __param(4, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getStock", null);
__decorate([
    (0, common_1.Get)('inventory/kardex/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Query)('tenantId')),
    __param(2, (0, common_1.Query)('warehouseId')),
    __param(3, (0, common_1.Headers)('authorization')),
    __param(4, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getKardex", null);
__decorate([
    (0, common_1.Post)('hr/employees'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createEmployee", null);
__decorate([
    (0, common_1.Post)('hr/attendance'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "registerAttendance", null);
__decorate([
    (0, common_1.Post)('hr/evaluations'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createEvaluation", null);
__decorate([
    (0, common_1.Post)('hr/payroll'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "generatePayroll", null);
__decorate([
    (0, common_1.Post)('hr/trainings'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createTraining", null);
__decorate([
    (0, common_1.Post)('financial/accounts'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createFinancialAccount", null);
__decorate([
    (0, common_1.Get)('financial/accounts'),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "listFinancialAccounts", null);
__decorate([
    (0, common_1.Post)('financial/transactions'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createFinancialTransaction", null);
__decorate([
    (0, common_1.Get)('financial/transactions'),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Query)('accountId')),
    __param(2, (0, common_1.Query)('transactionType')),
    __param(3, (0, common_1.Headers)('authorization')),
    __param(4, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "listFinancialTransactions", null);
__decorate([
    (0, common_1.Get)('financial/reports/cash-flow'),
    __param(0, (0, common_1.Query)('tenantId')),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getCashFlowReport", null);
__decorate([
    (0, common_1.Post)('assets/assets'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createAsset", null);
__decorate([
    (0, common_1.Post)('assets/assignments'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "assignAsset", null);
__decorate([
    (0, common_1.Post)('assets/movements'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "registerAssetMovement", null);
__decorate([
    (0, common_1.Post)('assets/depreciation'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "registerAssetDepreciation", null);
__decorate([
    (0, common_1.Post)('notifications/email'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "sendEmailNotification", null);
__decorate([
    (0, common_1.Post)('notifications/whatsapp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "sendWhatsappNotification", null);
__decorate([
    (0, common_1.Post)('files/upload'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('files/:fileId'),
    __param(0, (0, common_1.Param)('fileId')),
    __param(1, (0, common_1.Query)('tenantId')),
    __param(2, (0, common_1.Headers)('authorization')),
    __param(3, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getFileMetadata", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map