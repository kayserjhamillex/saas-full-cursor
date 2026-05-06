"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let WhatsappService = class WhatsappService {
    sendMessage(payload) {
        if (!payload.tenantId) {
            throw new common_1.BadRequestException('tenantId es obligatorio');
        }
        if (!payload.phoneNumber || !/^\+?[1-9]\d{7,14}$/.test(payload.phoneNumber)) {
            throw new common_1.BadRequestException('Numero de telefono invalido');
        }
        if (!payload.message) {
            throw new common_1.BadRequestException('message es obligatorio');
        }
        return {
            id: (0, crypto_1.randomUUID)(),
            event: 'message_sent',
            status: 'queued',
            tenantId: payload.tenantId,
            phoneNumber: payload.phoneNumber,
            provider: 'whatsapp_mock',
            eventType: payload.eventType ?? 'notification_requested',
            message: payload.message,
            sentAt: new Date().toISOString(),
        };
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = __decorate([
    (0, common_1.Injectable)()
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map