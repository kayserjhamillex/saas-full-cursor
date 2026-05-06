import { AppService } from './app.service';
type LoginRequest = {
    email?: string;
    password?: string;
    tenantId?: string;
};
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    login(body: LoginRequest): Promise<any>;
    validateProtectedTenantRoute(tenantId: string, authorization: string | undefined, requestTenantId: string | undefined, moduleName: string | undefined): Promise<any>;
    createPatient(body: {
        tenantId?: string;
        name?: string;
        document?: string;
        birthDate?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    createEncounter(body: {
        tenantId?: string;
        patientId?: string;
        encounterDate?: string;
        notes?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    createDiagnosis(body: {
        tenantId?: string;
        patientId?: string;
        encounterId?: string;
        description?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    createTreatment(body: {
        tenantId?: string;
        patientId?: string;
        encounterId?: string;
        description?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    createPrescription(body: {
        tenantId?: string;
        patientId?: string;
        encounterId?: string;
        medication?: string;
        dosage?: string;
        instructions?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    createEvolution(body: {
        tenantId?: string;
        patientId?: string;
        encounterId?: string;
        notes?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    updateOdontogram(body: {
        tenantId?: string;
        patientId?: string;
        chartData?: Record<string, unknown>;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    getClinicalTimeline(patientId: string, tenantId: string | undefined, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    processClinicalImage(body: {
        tenantId?: string;
        patientId?: string;
        encounterId?: string;
        imageName?: string;
        mimeType?: string;
        imageBase64?: string;
        modelType?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    getClinicalAiResults(patientId: string, tenantId: string | undefined, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    createProduct(body: {
        tenantId?: string;
        categoryId?: string;
        subcategoryId?: string;
        sku?: string;
        name?: string;
        unit?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    createWarehouse(body: {
        tenantId?: string;
        name?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    registerStockEntry(body: {
        tenantId?: string;
        productId?: string;
        warehouseId?: string;
        quantity?: number;
        reference?: string;
        notes?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    registerStockExit(body: {
        tenantId?: string;
        productId?: string;
        warehouseId?: string;
        quantity?: number;
        reference?: string;
        notes?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    transferStock(body: {
        tenantId?: string;
        productId?: string;
        fromWarehouseId?: string;
        toWarehouseId?: string;
        quantity?: number;
        reference?: string;
        notes?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    getStock(productId: string, tenantId: string | undefined, warehouseId: string | undefined, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    getKardex(productId: string, tenantId: string | undefined, warehouseId: string | undefined, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    createEmployee(body: {
        tenantId?: string;
        fullName?: string;
        documentNumber?: string;
        email?: string;
        roleName?: string;
        position?: string;
        status?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    registerAttendance(body: {
        tenantId?: string;
        employeeId?: string;
        checkInAt?: string;
        checkOutAt?: string;
        status?: string;
        notes?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    createEvaluation(body: {
        tenantId?: string;
        employeeId?: string;
        evaluatorName?: string;
        score?: number;
        comments?: string;
        evaluatedAt?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    generatePayroll(body: {
        tenantId?: string;
        employeeId?: string;
        periodLabel?: string;
        baseAmount?: number;
        bonusAmount?: number;
        deductionAmount?: number;
        status?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    createTraining(body: {
        tenantId?: string;
        employeeId?: string;
        title?: string;
        provider?: string;
        status?: string;
        completedAt?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    createFinancialAccount(body: {
        tenantId?: string;
        name?: string;
        accountType?: string;
        currency?: string;
        initialBalance?: number;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    listFinancialAccounts(tenantId: string | undefined, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    createFinancialTransaction(body: {
        tenantId?: string;
        accountId?: string;
        transactionType?: 'income' | 'expense';
        amount?: number;
        sourceModule?: string;
        reference?: string;
        notes?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    listFinancialTransactions(tenantId: string | undefined, accountId: string | undefined, transactionType: string | undefined, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    getCashFlowReport(tenantId: string | undefined, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    createAsset(body: {
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
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    assignAsset(body: {
        tenantId?: string;
        assetId?: string;
        employeeId?: string;
        areaName?: string;
        notes?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    registerAssetMovement(body: {
        tenantId?: string;
        assetId?: string;
        movementType?: string;
        fromLocation?: string;
        toLocation?: string;
        notes?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    registerAssetDepreciation(body: {
        tenantId?: string;
        assetId?: string;
        periodLabel?: string;
        amount?: number;
        method?: string;
        financialAccountId?: string;
        notes?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    sendEmailNotification(body: {
        tenantId?: string;
        to?: string;
        subject?: string;
        template?: string;
        variables?: Record<string, unknown>;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    sendWhatsappNotification(body: {
        tenantId?: string;
        phoneNumber?: string;
        message?: string;
        eventType?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    uploadFile(body: {
        tenantId?: string;
        patientId?: string;
        encounterId?: string;
        sourceModule?: string;
        fileName?: string;
        mimeType?: string;
        fileBase64?: string;
    }, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
    getFileMetadata(fileId: string, tenantId: string | undefined, authorization: string | undefined, requestTenantId: string | undefined): Promise<any>;
}
export {};
