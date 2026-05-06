import { JwtService } from '@nestjs/jwt';
type LoginRequest = {
    email?: string;
    password?: string;
    tenantId?: string;
};
export declare class AppService {
    private readonly jwtService;
    private readonly authServiceUrl;
    private readonly coreServiceUrl;
    private readonly clinicalServiceUrl;
    private readonly inventoryServiceUrl;
    private readonly hrServiceUrl;
    private readonly financialServiceUrl;
    private readonly assetsServiceUrl;
    private readonly emailServiceUrl;
    private readonly whatsappServiceUrl;
    private readonly fileServiceUrl;
    constructor(jwtService: JwtService);
    forwardLogin(payload: LoginRequest): Promise<any>;
    validateAndForwardTenant(tenantId: string, authorization: string | undefined, requestTenantId: string | undefined, moduleName?: string): Promise<any>;
    forwardClinicalRequest(payload: {
        tenantId: string;
        authorization: string | undefined;
        requestTenantId: string | undefined;
        path: string;
        method: 'GET' | 'POST';
        query?: Record<string, string | undefined>;
        body?: unknown;
    }): Promise<any>;
    forwardInventoryRequest(payload: {
        tenantId: string;
        authorization: string | undefined;
        requestTenantId: string | undefined;
        path: string;
        method: 'GET' | 'POST';
        query?: Record<string, string | undefined>;
        body?: unknown;
    }): Promise<any>;
    forwardHrRequest(payload: {
        tenantId: string;
        authorization: string | undefined;
        requestTenantId: string | undefined;
        path: string;
        method: 'POST';
        body?: unknown;
    }): Promise<any>;
    forwardFinancialRequest(payload: {
        tenantId: string;
        authorization: string | undefined;
        requestTenantId: string | undefined;
        path: string;
        method: 'GET' | 'POST';
        query?: Record<string, string | undefined>;
        body?: unknown;
    }): Promise<any>;
    forwardAssetsRequest(payload: {
        tenantId: string;
        authorization: string | undefined;
        requestTenantId: string | undefined;
        path: string;
        method: 'POST';
        body?: unknown;
    }): Promise<any>;
    forwardEmailRequest(payload: {
        tenantId: string;
        authorization: string | undefined;
        requestTenantId: string | undefined;
        body?: unknown;
    }): Promise<any>;
    forwardWhatsappRequest(payload: {
        tenantId: string;
        authorization: string | undefined;
        requestTenantId: string | undefined;
        body?: unknown;
    }): Promise<any>;
    forwardFileUploadRequest(payload: {
        tenantId: string;
        authorization: string | undefined;
        requestTenantId: string | undefined;
        body?: unknown;
    }): Promise<any>;
    forwardFileReadRequest(payload: {
        tenantId: string;
        authorization: string | undefined;
        requestTenantId: string | undefined;
        fileId: string;
    }): Promise<any>;
    private extractBearerToken;
    private verifyToken;
}
export {};
