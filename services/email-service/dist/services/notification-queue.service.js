"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NotificationQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationQueueService = void 0;
const common_1 = require("@nestjs/common");
let NotificationQueueService = NotificationQueueService_1 = class NotificationQueueService {
    logger = new common_1.Logger(NotificationQueueService_1.name);
    maxRetries = Math.max(0, Number(process.env.EMAIL_QUEUE_MAX_RETRIES ?? 3));
    retryDelayMs = Math.max(100, Number(process.env.EMAIL_QUEUE_RETRY_DELAY_MS ?? 400));
    enqueue(job) {
        const queueJob = {
            ...job,
            attempts: 0,
            maxAttempts: this.maxRetries,
        };
        void this.runJob(queueJob);
    }
    async runJob(job) {
        for (let attempt = 0; attempt <= job.maxAttempts; attempt += 1) {
            try {
                await this.simulateProviderSend({ ...job, attempts: attempt });
                return;
            }
            catch (error) {
                if (attempt < job.maxAttempts) {
                    this.logger.warn(`Reintentando envio email job=${job.id} intento=${attempt + 1}/${job.maxAttempts}`);
                    await this.delay(this.retryDelayMs * (attempt + 1));
                    continue;
                }
                this.logger.error(`Fallo definitivo enviando email job=${job.id} tenant=${job.payload.tenantId}: ${String(error)}`);
            }
        }
    }
    async simulateProviderSend(job) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        this.logger.log(`Email enviado job=${job.id} tenant=${job.payload.tenantId} to=${job.payload.to} subject=${job.payload.subject}`);
    }
    async delay(ms) {
        await new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.NotificationQueueService = NotificationQueueService;
exports.NotificationQueueService = NotificationQueueService = NotificationQueueService_1 = __decorate([
    (0, common_1.Injectable)()
], NotificationQueueService);
//# sourceMappingURL=notification-queue.service.js.map