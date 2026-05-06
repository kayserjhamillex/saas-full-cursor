import {
  BadRequestException,
  BadGatewayException,
  ForbiddenException,
  Injectable,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type LoginRequest = {
  email?: string;
  password?: string;
  tenantId?: string;
};

type JwtPayload = {
  sub: string;
  email: string;
  tenantId: string;
  roleId?: string;
  iat: number;
  exp: number;
};

type UpstreamHttpMethod = 'GET' | 'POST';

type UpstreamForwardPayload = {
  tenantId: string;
  authorization: string | undefined;
  requestTenantId: string | undefined;
  path?: string;
  method: UpstreamHttpMethod;
  query?: Record<string, string | undefined>;
  body?: unknown;
};

type UpstreamContract = {
  baseUrl: string;
  basePath: string;
  tenantModule: string;
};

@Injectable()
export class AppService {
  private readonly authServiceUrl =
    process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001';
  private readonly coreServiceUrl =
    process.env.CORE_SERVICE_URL ?? 'http://localhost:3002';
  private readonly clinicalServiceUrl =
    process.env.CLINICAL_SERVICE_URL ?? 'http://localhost:3003';
  private readonly inventoryServiceUrl =
    process.env.INVENTORY_SERVICE_URL ?? 'http://localhost:3004';
  private readonly hrServiceUrl =
    process.env.HR_SERVICE_URL ?? 'http://localhost:3005';
  private readonly financialServiceUrl =
    process.env.FINANCIAL_SERVICE_URL ?? 'http://localhost:3006';
  private readonly assetsServiceUrl =
    process.env.ASSETS_SERVICE_URL ?? 'http://localhost:3007';
  private readonly emailServiceUrl =
    process.env.EMAIL_SERVICE_URL ?? 'http://localhost:3011';
  private readonly whatsappServiceUrl =
    process.env.WHATSAPP_SERVICE_URL ?? 'http://localhost:3012';
  private readonly fileServiceUrl =
    process.env.FILE_SERVICE_URL ?? 'http://localhost:3013';
  private readonly internalServiceToken = process.env.INTERNAL_SERVICE_TOKEN;
  private readonly tenantCacheEnabled =
    (process.env.ENABLE_TENANT_CACHE ?? 'true').toLowerCase() !== 'false';
  private readonly tenantCacheTtlMs =
    Math.max(5, Number(process.env.TENANT_CACHE_TTL_SECONDS ?? 30)) * 1000;
  private readonly upstreamTimeoutMs = Math.max(
    1000,
    Number(process.env.UPSTREAM_TIMEOUT_MS ?? 5000),
  );
  private readonly tenantValidationCache = new Map<
    string,
    { expiresAt: number; value: unknown }
  >();

  constructor(private readonly jwtService: JwtService) {}

  async forwardLogin(payload: LoginRequest) {
    return this.requestJson(
      `${this.authServiceUrl}/auth/login`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
      'No se pudo autenticar',
      UnauthorizedException,
    );
  }

  async validateAndForwardTenant(
    tenantId: string,
    authorization: string | undefined,
    requestTenantId: string | undefined,
    moduleName?: string,
  ) {
    const sanitizedTenantId = this.ensureTenantId(tenantId);
    const sanitizedRequestTenantId = this.ensureTenantId(requestTenantId);
    const token = this.extractBearerToken(authorization);
    const payload = await this.verifyToken(token);

    if (
      sanitizedRequestTenantId !== payload.tenantId ||
      sanitizedTenantId !== payload.tenantId
    ) {
      throw new ForbiddenException('Tenant no coincide con el token');
    }

    const cacheKey = `${sanitizedTenantId}:${moduleName ?? 'all'}`;
    if (this.tenantCacheEnabled) {
      const cached = this.tenantValidationCache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        return cached.value;
      }
    }

    const moduleQuery = moduleName
      ? `?module=${encodeURIComponent(moduleName)}`
      : '';
    const body = await this.requestJson(
      `${this.coreServiceUrl}/core/tenants/internal/${sanitizedTenantId}/validate${moduleQuery}`,
      {
        method: 'GET',
        headers: this.buildCoreInternalHeaders(
          authorization,
          sanitizedRequestTenantId,
        ),
      },
      'Tenant invalido',
      ForbiddenException,
    );

    if (this.tenantCacheEnabled) {
      this.tenantValidationCache.set(cacheKey, {
        expiresAt: Date.now() + this.tenantCacheTtlMs,
        value: body,
      });
    }

    return body;
  }

  async forwardClinicalRequest(payload: {
    tenantId: string;
    authorization: string | undefined;
    requestTenantId: string | undefined;
    path: string;
    method: 'GET' | 'POST';
    query?: Record<string, string | undefined>;
    body?: unknown;
  }) {
    return this.forwardToService(
      payload,
      {
        baseUrl: this.clinicalServiceUrl,
        basePath: 'clinical',
        tenantModule: 'clinical',
      },
      'No se pudo procesar la solicitud clínica',
    );
  }

  async forwardInventoryRequest(payload: {
    tenantId: string;
    authorization: string | undefined;
    requestTenantId: string | undefined;
    path: string;
    method: 'GET' | 'POST';
    query?: Record<string, string | undefined>;
    body?: unknown;
  }) {
    return this.forwardToService(
      payload,
      {
        baseUrl: this.inventoryServiceUrl,
        basePath: 'inventory',
        tenantModule: 'inventory',
      },
      'No se pudo procesar la solicitud de inventario',
    );
  }

  async forwardHrRequest(payload: {
    tenantId: string;
    authorization: string | undefined;
    requestTenantId: string | undefined;
    path: string;
    method: 'POST';
    body?: unknown;
  }) {
    return this.forwardToService(
      payload,
      {
        baseUrl: this.hrServiceUrl,
        basePath: 'hr',
        tenantModule: 'hr',
      },
      'No se pudo procesar la solicitud de RRHH',
    );
  }

  async forwardFinancialRequest(payload: {
    tenantId: string;
    authorization: string | undefined;
    requestTenantId: string | undefined;
    path: string;
    method: 'GET' | 'POST';
    query?: Record<string, string | undefined>;
    body?: unknown;
  }) {
    return this.forwardToService(
      payload,
      {
        baseUrl: this.financialServiceUrl,
        basePath: 'financial',
        tenantModule: 'financial',
      },
      'No se pudo procesar la solicitud financiera',
    );
  }

  async forwardAssetsRequest(payload: {
    tenantId: string;
    authorization: string | undefined;
    requestTenantId: string | undefined;
    path: string;
    method: 'POST';
    body?: unknown;
  }) {
    return this.forwardToService(
      payload,
      {
        baseUrl: this.assetsServiceUrl,
        basePath: 'assets',
        tenantModule: 'assets',
      },
      'No se pudo procesar la solicitud de patrimonio',
    );
  }

  async forwardEmailRequest(payload: {
    tenantId: string;
    authorization: string | undefined;
    requestTenantId: string | undefined;
    body?: unknown;
  }) {
    return this.forwardToService(
      {
        ...payload,
        method: 'POST',
        path: 'send',
      },
      {
        baseUrl: this.emailServiceUrl,
        basePath: 'email',
        tenantModule: 'scheduling',
      },
      'No se pudo enviar el correo',
    );
  }

  async forwardWhatsappRequest(payload: {
    tenantId: string;
    authorization: string | undefined;
    requestTenantId: string | undefined;
    body?: unknown;
  }) {
    return this.forwardToService(
      {
        ...payload,
        method: 'POST',
        path: 'send',
      },
      {
        baseUrl: this.whatsappServiceUrl,
        basePath: 'whatsapp',
        tenantModule: 'scheduling',
      },
      'No se pudo enviar el mensaje por WhatsApp',
    );
  }

  async forwardFileUploadRequest(payload: {
    tenantId: string;
    authorization: string | undefined;
    requestTenantId: string | undefined;
    body?: unknown;
  }) {
    return this.forwardToService(
      {
        ...payload,
        method: 'POST',
        path: 'upload',
      },
      {
        baseUrl: this.fileServiceUrl,
        basePath: 'files',
        tenantModule: 'clinical',
      },
      'No se pudo cargar el archivo',
    );
  }

  async forwardFileReadRequest(payload: {
    tenantId: string;
    authorization: string | undefined;
    requestTenantId: string | undefined;
    fileId: string;
  }) {
    const sanitizedTenantId = this.ensureTenantId(payload.tenantId);
    return this.forwardToService(
      {
        tenantId: sanitizedTenantId,
        authorization: payload.authorization,
        requestTenantId: payload.requestTenantId,
        method: 'GET',
        path: encodeURIComponent(payload.fileId),
        query: { tenantId: sanitizedTenantId },
      },
      {
        baseUrl: this.fileServiceUrl,
        basePath: 'files',
        tenantModule: 'clinical',
      },
      'No se pudo consultar el archivo',
    );
  }

  private async forwardToService(
    payload: UpstreamForwardPayload,
    contract: UpstreamContract,
    defaultErrorMessage: string,
  ) {
    const sanitizedTenantId = this.ensureTenantId(payload.tenantId);
    const sanitizedRequestTenantId = this.ensureTenantId(
      payload.requestTenantId,
    );

    await this.validateAndForwardTenant(
      sanitizedTenantId,
      payload.authorization,
      sanitizedRequestTenantId,
      contract.tenantModule,
    );

    const url = this.buildServiceUrl(
      contract.baseUrl,
      contract.basePath,
      payload.path,
      payload.query,
    );

    return this.requestJson(
      url,
      {
        method: payload.method,
        headers: this.buildForwardHeaders(
          payload.authorization,
          sanitizedRequestTenantId,
        ),
        body: payload.body ? JSON.stringify(payload.body) : undefined,
      },
      defaultErrorMessage,
    );
  }

  private buildServiceUrl(
    baseUrl: string,
    basePath: string,
    path: string | undefined,
    query: Record<string, string | undefined> | undefined,
  ) {
    const normalizedBasePath = basePath.replace(/^\/+|\/+$/g, '');
    const normalizedPath = (path ?? '').replace(/^\/+|\/+$/g, '');
    const routePath = normalizedPath
      ? `${normalizedBasePath}/${normalizedPath}`
      : normalizedBasePath;
    const queryParams = this.buildQueryParams(query);

    return `${baseUrl}/${routePath}${queryParams ? `?${queryParams}` : ''}`;
  }

  private buildQueryParams(
    query: Record<string, string | undefined> | undefined,
  ) {
    if (!query) {
      return '';
    }
    return Object.entries(query)
      .filter(([, value]) => value && value.length > 0)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`,
      )
      .join('&');
  }

  private ensureTenantId(value: string | undefined) {
    const tenantId = value?.trim();
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    return tenantId;
  }

  private buildForwardHeaders(
    authorization: string | undefined,
    requestTenantId: string,
  ) {
    return {
      'content-type': 'application/json',
      authorization: authorization ?? '',
      'x-tenant-id': requestTenantId,
    };
  }

  private buildCoreInternalHeaders(
    authorization: string | undefined,
    requestTenantId: string,
  ) {
    if (
      !this.internalServiceToken ||
      this.internalServiceToken.trim().length === 0
    ) {
      throw new ServiceUnavailableException(
        'Configuracion interna incompleta para validar tenant',
      );
    }

    return {
      ...this.buildForwardHeaders(authorization, requestTenantId),
      'x-internal-service-token': this.internalServiceToken,
    };
  }

  private async requestJson<TResponse = unknown>(
    url: string,
    options: RequestInit,
    defaultErrorMessage: string,
    UpstreamException: new (message?: string) => Error = BadRequestException,
  ): Promise<TResponse> {
    const abortController = new AbortController();
    const timeout = setTimeout(
      () => abortController.abort(),
      this.upstreamTimeoutMs,
    );

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortController.signal,
      });

      let body: unknown = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }

      if (!response.ok) {
        const message = this.extractUpstreamErrorMessage(
          body,
          defaultErrorMessage,
        );
        throw new UpstreamException(message);
      }

      return body as TResponse;
    } catch (error) {
      if (
        error instanceof RequestTimeoutException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new RequestTimeoutException(
          `Tiempo de espera agotado al llamar a ${url}`,
        );
      }

      if (error instanceof Error) {
        throw new BadGatewayException(
          `Error de comunicacion con servicio aguas abajo: ${error.message}`,
        );
      }

      throw new ServiceUnavailableException(
        'Servicio temporalmente no disponible',
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  private extractBearerToken(authorization: string | undefined) {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header es obligatorio');
    }

    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token invalido');
    }
    return token;
  }

  private async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        issuer: process.env.JWT_ISSUER ?? 'auth-service',
        audience: process.env.JWT_AUDIENCE ?? 'api-gateway',
      });
    } catch {
      throw new UnauthorizedException('Token invalido o expirado');
    }
  }

  private extractUpstreamErrorMessage(
    body: unknown,
    defaultMessage: string,
  ): string {
    if (!body || typeof body !== 'object') {
      return defaultMessage;
    }

    const record = body as Record<string, unknown>;
    const message = record.message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
    if (Array.isArray(message) && message.length > 0) {
      return message
        .map((item) => (typeof item === 'string' ? item : String(item)))
        .join('; ');
    }

    const nestedError = record.error;
    if (nestedError && typeof nestedError === 'object') {
      const nestedMessage = (nestedError as { message?: unknown }).message;
      if (
        typeof nestedMessage === 'string' &&
        nestedMessage.trim().length > 0
      ) {
        return nestedMessage;
      }
    }

    return defaultMessage;
  }
}
