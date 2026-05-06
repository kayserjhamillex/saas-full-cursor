"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServiceTokenGuard = void 0;
const common_1 = require("@nestjs/common");
let InternalServiceTokenGuard = class InternalServiceTokenGuard {
    canActivate(context) {
        const expectedToken = process.env.INTERNAL_SERVICE_TOKEN?.trim();
        if (!expectedToken) {
            throw new common_1.UnauthorizedException('Token interno no configurado');
        }
        const request = context.switchToHttp().getRequest();
        const providedToken = request.headers['x-internal-service-token'];
        const normalizedToken = typeof providedToken === 'string' ? providedToken.trim() : '';
        if (!normalizedToken || normalizedToken !== expectedToken) {
            throw new common_1.UnauthorizedException('Token interno invalido');
        }
        return true;
    }
};
exports.InternalServiceTokenGuard = InternalServiceTokenGuard;
exports.InternalServiceTokenGuard = InternalServiceTokenGuard = __decorate([
    (0, common_1.Injectable)()
], InternalServiceTokenGuard);
//# sourceMappingURL=internal-service-token.guard.js.map