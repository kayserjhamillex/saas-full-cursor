import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class InternalServiceTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
