import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class GatewayRequestValidationService {
  requireNonEmpty(value: string | undefined, fieldName: string): string {
    const normalizedValue = value?.trim();
    if (!normalizedValue) {
      throw new BadRequestException(`${fieldName} es obligatorio`);
    }
    return normalizedValue;
  }

  ensureBearerAuthorization(authorization: string | undefined): void {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header es obligatorio');
    }
    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token invalido');
    }
  }

  requirePositiveNumber(value: number | undefined, fieldName: string): number {
    if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
      throw new BadRequestException(`${fieldName} debe ser mayor a 0`);
    }
    return value;
  }
}
