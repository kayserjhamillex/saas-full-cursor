import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import type { Request, Response } from 'express';

@Injectable()
export class GatewayResponseInterceptor implements NestInterceptor {
  constructor(private readonly serviceName: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const traceIdHeader = response.getHeader('x-trace-id');
    const traceId =
      typeof traceIdHeader === 'string' && traceIdHeader.trim().length > 0
        ? traceIdHeader
        : null;

    return next.handle().pipe(
      map((data: unknown) => ({
        success: true,
        service: this.serviceName,
        traceId,
        timestamp: new Date().toISOString(),
        path: request.originalUrl,
        method: request.method,
        data,
      })),
    );
  }
}
