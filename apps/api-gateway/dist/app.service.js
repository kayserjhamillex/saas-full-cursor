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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AppService = class AppService {
    jwtService;
    authServiceUrl = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001';
    coreServiceUrl = process.env.CORE_SERVICE_URL ?? 'http://localhost:3002';
    clinicalServiceUrl = process.env.CLINICAL_SERVICE_URL ?? 'http://localhost:3003';
    inventoryServiceUrl = process.env.INVENTORY_SERVICE_URL ?? 'http://localhost:3004';
    hrServiceUrl = process.env.HR_SERVICE_URL ?? 'http://localhost:3005';
    financialServiceUrl = process.env.FINANCIAL_SERVICE_URL ?? 'http://localhost:3006';
    assetsServiceUrl = process.env.ASSETS_SERVICE_URL ?? 'http://localhost:3007';
    emailServiceUrl = process.env.EMAIL_SERVICE_URL ?? 'http://localhost:3011';
    whatsappServiceUrl = process.env.WHATSAPP_SERVICE_URL ?? 'http://localhost:3012';
    fileServiceUrl = process.env.FILE_SERVICE_URL ?? 'http://localhost:3013';
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async forwardLogin(payload) {
        const response = await fetch(`${this.authServiceUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const body = await response.json();
        if (!response.ok) {
            throw new common_1.UnauthorizedException(body?.message ?? 'No se pudo autenticar');
        }
        return body;
    }
    async validateAndForwardTenant(tenantId, authorization, requestTenantId, moduleName) {
        const token = this.extractBearerToken(authorization);
        const payload = await this.verifyToken(token);
        if (!requestTenantId) {
            throw new common_1.BadRequestException('x-tenant-id es obligatorio');
        }
        if (requestTenantId !== payload.tenantId || tenantId !== payload.tenantId) {
            throw new common_1.ForbiddenException('Tenant no coincide con el token');
        }
        const moduleQuery = moduleName
            ? `?module=${encodeURIComponent(moduleName)}`
            : '';
        const response = await fetch(`${this.coreServiceUrl}/core/tenants/internal/${tenantId}/validate${moduleQuery}`, {
            method: 'GET',
        });
        const body = await response.json();
        if (!response.ok) {
            throw new common_1.ForbiddenException(body?.message ?? 'Tenant invalido');
        }
        return body;
    }
    async forwardClinicalRequest(payload) {
        await this.validateAndForwardTenant(payload.tenantId, payload.authorization, payload.requestTenantId, 'clinical');
        const queryParams = payload.query
            ? Object.entries(payload.query)
                .filter(([, value]) => value && value.length > 0)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`)
                .join('&')
            : '';
        const url = `${this.clinicalServiceUrl}/clinical/${payload.path}${queryParams ? `?${queryParams}` : ''}`;
        const response = await fetch(url, {
            method: payload.method,
            headers: {
                'content-type': 'application/json',
            },
            body: payload.body ? JSON.stringify(payload.body) : undefined,
        });
        const responseBody = await response.json();
        if (!response.ok) {
            throw new common_1.BadRequestException(responseBody?.message ?? 'No se pudo procesar la solicitud clínica');
        }
        return responseBody;
    }
    async forwardInventoryRequest(payload) {
        await this.validateAndForwardTenant(payload.tenantId, payload.authorization, payload.requestTenantId, 'inventory');
        const queryParams = payload.query
            ? Object.entries(payload.query)
                .filter(([, value]) => value && value.length > 0)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`)
                .join('&')
            : '';
        const url = `${this.inventoryServiceUrl}/inventory/${payload.path}${queryParams ? `?${queryParams}` : ''}`;
        const response = await fetch(url, {
            method: payload.method,
            headers: {
                'content-type': 'application/json',
            },
            body: payload.body ? JSON.stringify(payload.body) : undefined,
        });
        const responseBody = await response.json();
        if (!response.ok) {
            throw new common_1.BadRequestException(responseBody?.message ?? 'No se pudo procesar la solicitud de inventario');
        }
        return responseBody;
    }
    async forwardHrRequest(payload) {
        await this.validateAndForwardTenant(payload.tenantId, payload.authorization, payload.requestTenantId, 'hr');
        const url = `${this.hrServiceUrl}/hr/${payload.path}`;
        const response = await fetch(url, {
            method: payload.method,
            headers: {
                'content-type': 'application/json',
            },
            body: payload.body ? JSON.stringify(payload.body) : undefined,
        });
        const responseBody = await response.json();
        if (!response.ok) {
            throw new common_1.BadRequestException(responseBody?.message ?? 'No se pudo procesar la solicitud de RRHH');
        }
        return responseBody;
    }
    async forwardFinancialRequest(payload) {
        await this.validateAndForwardTenant(payload.tenantId, payload.authorization, payload.requestTenantId, 'financial');
        const queryParams = payload.query
            ? Object.entries(payload.query)
                .filter(([, value]) => value && value.length > 0)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`)
                .join('&')
            : '';
        const url = `${this.financialServiceUrl}/financial/${payload.path}${queryParams ? `?${queryParams}` : ''}`;
        const response = await fetch(url, {
            method: payload.method,
            headers: {
                'content-type': 'application/json',
            },
            body: payload.body ? JSON.stringify(payload.body) : undefined,
        });
        const responseBody = await response.json();
        if (!response.ok) {
            throw new common_1.BadRequestException(responseBody?.message ?? 'No se pudo procesar la solicitud financiera');
        }
        return responseBody;
    }
    async forwardAssetsRequest(payload) {
        await this.validateAndForwardTenant(payload.tenantId, payload.authorization, payload.requestTenantId, 'assets');
        const url = `${this.assetsServiceUrl}/assets/${payload.path}`;
        const response = await fetch(url, {
            method: payload.method,
            headers: {
                'content-type': 'application/json',
            },
            body: payload.body ? JSON.stringify(payload.body) : undefined,
        });
        const responseBody = await response.json();
        if (!response.ok) {
            throw new common_1.BadRequestException(responseBody?.message ?? 'No se pudo procesar la solicitud de patrimonio');
        }
        return responseBody;
    }
    async forwardEmailRequest(payload) {
        await this.validateAndForwardTenant(payload.tenantId, payload.authorization, payload.requestTenantId, 'scheduling');
        const response = await fetch(`${this.emailServiceUrl}/email/send`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: payload.body ? JSON.stringify(payload.body) : undefined,
        });
        const responseBody = await response.json();
        if (!response.ok) {
            throw new common_1.BadRequestException(responseBody?.message ?? 'No se pudo enviar el correo');
        }
        return responseBody;
    }
    async forwardWhatsappRequest(payload) {
        await this.validateAndForwardTenant(payload.tenantId, payload.authorization, payload.requestTenantId, 'scheduling');
        const response = await fetch(`${this.whatsappServiceUrl}/whatsapp/send`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: payload.body ? JSON.stringify(payload.body) : undefined,
        });
        const responseBody = await response.json();
        if (!response.ok) {
            throw new common_1.BadRequestException(responseBody?.message ?? 'No se pudo enviar el mensaje por WhatsApp');
        }
        return responseBody;
    }
    async forwardFileUploadRequest(payload) {
        await this.validateAndForwardTenant(payload.tenantId, payload.authorization, payload.requestTenantId, 'clinical');
        const response = await fetch(`${this.fileServiceUrl}/files/upload`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: payload.body ? JSON.stringify(payload.body) : undefined,
        });
        const responseBody = await response.json();
        if (!response.ok) {
            throw new common_1.BadRequestException(responseBody?.message ?? 'No se pudo cargar el archivo');
        }
        return responseBody;
    }
    async forwardFileReadRequest(payload) {
        await this.validateAndForwardTenant(payload.tenantId, payload.authorization, payload.requestTenantId, 'clinical');
        const queryParams = `tenantId=${encodeURIComponent(payload.tenantId)}`;
        const response = await fetch(`${this.fileServiceUrl}/files/${encodeURIComponent(payload.fileId)}?${queryParams}`, {
            method: 'GET',
        });
        const responseBody = await response.json();
        if (!response.ok) {
            throw new common_1.BadRequestException(responseBody?.message ?? 'No se pudo consultar el archivo');
        }
        return responseBody;
    }
    extractBearerToken(authorization) {
        if (!authorization) {
            throw new common_1.UnauthorizedException('Authorization header es obligatorio');
        }
        const [scheme, token] = authorization.split(' ');
        if (scheme !== 'Bearer' || !token) {
            throw new common_1.UnauthorizedException('Formato de token invalido');
        }
        return token;
    }
    async verifyToken(token) {
        try {
            return await this.jwtService.verifyAsync(token);
        }
        catch {
            throw new common_1.UnauthorizedException('Token invalido o expirado');
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AppService);
//# sourceMappingURL=app.service.js.map