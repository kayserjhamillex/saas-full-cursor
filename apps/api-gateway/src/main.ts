import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { randomUUID } from 'crypto';
import type { Express, NextFunction, Request, Response } from 'express';
import { GatewayExceptionFilter } from './shared/filters/gateway-exception.filter';
import { GatewayResponseInterceptor } from './shared/interceptors/gateway-response.interceptor';

function ensureRequiredEnv() {
  const requiredEnvVars = ['JWT_SECRET', 'INTERNAL_SERVICE_TOKEN'];
  const missingEnvVars = requiredEnvVars.filter((envVar) => {
    const value = process.env[envVar];
    return !value || value.trim().length === 0;
  });

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Faltan variables de entorno obligatorias: ${missingEnvVars.join(', ')}`,
    );
  }
}

async function bootstrap() {
  ensureRequiredEnv();
  const serviceName = 'api-gateway';
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GatewayExceptionFilter(serviceName));
  app.useGlobalInterceptors(new GatewayResponseInterceptor(serviceName));
  const expressApp = app.getHttpAdapter().getInstance() as Express;

  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    const startedAt = Date.now();
    const traceIdHeader = req.headers['x-trace-id'];
    const traceId =
      typeof traceIdHeader === 'string' && traceIdHeader.trim().length > 0
        ? traceIdHeader
        : randomUUID();
    res.setHeader('x-trace-id', traceId);

    res.on('finish', () => {
      const payload = {
        level: 'info',
        service: serviceName,
        traceId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - startedAt,
        tenantId: req.headers['x-tenant-id'] ?? null,
        userAgent: req.headers['user-agent'] ?? null,
        timestamp: new Date().toISOString(),
      };
      console.log(JSON.stringify(payload));
    });

    next();
  });

  expressApp.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: serviceName,
      timestamp: new Date().toISOString(),
    });
  });

  expressApp.get('/metrics', (_req: Request, res: Response) => {
    const memory = process.memoryUsage();
    res.setHeader('Content-Type', 'text/plain; version=0.0.4');
    res.send(
      [
        '# HELP nodejs_process_uptime_seconds Node.js process uptime in seconds',
        '# TYPE nodejs_process_uptime_seconds gauge',
        `nodejs_process_uptime_seconds ${process.uptime()}`,
        '# HELP nodejs_process_resident_memory_bytes Resident memory size in bytes',
        '# TYPE nodejs_process_resident_memory_bytes gauge',
        `nodejs_process_resident_memory_bytes ${memory.rss}`,
        '# HELP nodejs_heap_used_bytes Process heap used in bytes',
        '# TYPE nodejs_heap_used_bytes gauge',
        `nodejs_heap_used_bytes ${memory.heapUsed}`,
      ].join('\n'),
    );
  });

  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/],
    credentials: true,
  });
  app.setGlobalPrefix('gateway');
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
