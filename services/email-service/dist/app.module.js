"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const email_controller_1 = require("./controllers/email.controller");
const internal_service_token_guard_1 = require("./guards/internal-service-token.guard");
const email_service_1 = require("./services/email.service");
const notification_queue_service_1 = require("./services/notification-queue.service");
const template_service_1 = require("./services/template.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [email_controller_1.EmailController],
        providers: [
            email_service_1.EmailService,
            template_service_1.TemplateService,
            notification_queue_service_1.NotificationQueueService,
            internal_service_token_guard_1.InternalServiceTokenGuard,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map