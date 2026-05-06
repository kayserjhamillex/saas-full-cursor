import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

type ErrorBody = {
  statusCode: number;
  message: string;
  error?: string;
  details?: unknown;
};

@Catch()
export class ServiceExceptionFilter implements ExceptionFilter {
  constructor(private readonly serviceName: string) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const traceIdHeader = response.getHeader('x-trace-id');
    const traceId =
      typeof traceIdHeader === 'string' && traceIdHeader.trim().length > 0
        ? traceIdHeader
        : null;

    let errorBody: ErrorBody = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servicio',
      error: 'InternalServerError',
    };

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const normalized = this.normalizeHttpException(exceptionResponse);
      errorBody = {
        statusCode,
        message: normalized.message,
        error: normalized.error,
        details: normalized.details,
      };
    }

    response.status(errorBody.statusCode).json({
      success: false,
      service: this.serviceName,
      traceId,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      method: request.method,
      error: {
        httpStatus: errorBody.statusCode,
        type: errorBody.error ?? 'Error',
        message: errorBody.message,
        details: errorBody.details ?? null,
      },
    });
  }

  private normalizeHttpException(
    exceptionResponse: string | object,
  ): Omit<ErrorBody, 'statusCode'> {
    if (typeof exceptionResponse === 'string') {
      return { message: exceptionResponse };
    }

    const record = exceptionResponse as Record<string, unknown>;
    const rawMessage = record.message;
    const rawError = record.error;

    return {
      message: Array.isArray(rawMessage)
        ? rawMessage.join('; ')
        : typeof rawMessage === 'string'
          ? rawMessage
          : 'Solicitud invalida',
      error: typeof rawError === 'string' ? rawError : undefined,
      details: record,
    };
  }
}
