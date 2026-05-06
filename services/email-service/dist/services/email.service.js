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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const notification_queue_service_1 = require("./notification-queue.service");
const template_service_1 = require("./template.service");
let EmailService = class EmailService {
    templateService;
    notificationQueueService;
    constructor(templateService, notificationQueueService) {
        this.templateService = templateService;
        this.notificationQueueService = notificationQueueService;
    }
    sendEmail(payload) {
        if (!payload.tenantId) {
            throw new common_1.BadRequestException('tenantId es obligatorio');
        }
        if (!payload.to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.to)) {
            throw new common_1.BadRequestException('Correo de destino invalido');
        }
        if (!payload.subject) {
            throw new common_1.BadRequestException('subject es obligatorio');
        }
        const compiledTemplate = this.templateService.compile(payload.template, payload.variables);
        const emailContent = compiledTemplate.renderedBody;
        const eventId = (0, crypto_1.randomUUID)();
        this.notificationQueueService.enqueue({
            id: eventId,
            payload: {
                tenantId: payload.tenantId,
                to: payload.to,
                subject: payload.subject,
                content: emailContent,
            },
        });
        return {
            id: eventId,
            event: 'email_sent',
            status: 'queued',
            tenantId: payload.tenantId,
            to: payload.to,
            subject: payload.subject,
            content: emailContent,
            templateData: compiledTemplate,
            provider: 'smtp_mock',
            sentAt: new Date().toISOString(),
        };
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [template_service_1.TemplateService,
        notification_queue_service_1.NotificationQueueService])
], EmailService);
//# sourceMappingURL=email.service.js.map