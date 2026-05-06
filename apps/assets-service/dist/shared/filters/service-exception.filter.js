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
exports.ServiceExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let ServiceExceptionFilter = class ServiceExceptionFilter {
    serviceName;
    constructor(serviceName) {
        this.serviceName = serviceName;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const traceIdHeader = response.getHeader("x-trace-id");
        const traceId = typeof traceIdHeader === "string" && traceIdHeader.trim().length > 0
            ? traceIdHeader
            : null;
        let errorBody = {
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: "Error interno del servicio",
            error: "InternalServerError",
        };
        if (exception instanceof common_1.HttpException) {
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
                type: errorBody.error ?? "Error",
                message: errorBody.message,
                details: errorBody.details ?? null,
            },
        });
    }
    normalizeHttpException(exceptionResponse) {
        if (typeof exceptionResponse === "string") {
            return { message: exceptionResponse };
        }
        const record = exceptionResponse;
        const rawMessage = record.message;
        const rawError = record.error;
        return {
            message: Array.isArray(rawMessage)
                ? rawMessage.join("; ")
                : typeof rawMessage === "string"
                    ? rawMessage
                    : "Solicitud invalida",
            error: typeof rawError === "string" ? rawError : undefined,
            details: record,
        };
    }
};
exports.ServiceExceptionFilter = ServiceExceptionFilter;
exports.ServiceExceptionFilter = ServiceExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [String])
], ServiceExceptionFilter);
//# sourceMappingURL=service-exception.filter.js.map