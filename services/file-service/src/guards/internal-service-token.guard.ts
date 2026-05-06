import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class InternalServiceTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expectedToken = process.env.INTERNAL_SERVICE_TOKEN?.trim();
    if (!expectedToken) {
      throw new UnauthorizedException('Token interno no configurado');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const providedToken = request.headers['x-internal-service-token'];
    const normalizedToken =
      typeof providedToken === 'string' ? providedToken.trim() : '';

    if (!normalizedToken || normalizedToken !== expectedToken) {
      throw new UnauthorizedException('Token interno invalido');
    }

    return true;
  }
}
