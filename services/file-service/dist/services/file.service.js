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
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const storage_service_1 = require("./storage.service");
const ALLOWED_MIME_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "application/pdf",
]);
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
let FileService = class FileService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    async uploadFile(payload) {
        if (!payload.tenantId) {
            throw new common_1.BadRequestException("tenantId es obligatorio");
        }
        if (!payload.fileName) {
            throw new common_1.BadRequestException("fileName es obligatorio");
        }
        if (!payload.mimeType || !ALLOWED_MIME_TYPES.has(payload.mimeType)) {
            throw new common_1.BadRequestException("Tipo de archivo no permitido");
        }
        if (!payload.fileBase64) {
            throw new common_1.BadRequestException("fileBase64 es obligatorio");
        }
        const sizeBytes = Buffer.from(payload.fileBase64, "base64").length;
        if (sizeBytes > MAX_FILE_SIZE_BYTES) {
            throw new common_1.BadRequestException("Archivo supera el tamano maximo permitido");
        }
        const savedFile = await this.storageService.save({
            tenantId: payload.tenantId,
            patientId: payload.patientId,
            encounterId: payload.encounterId,
            sourceModule: payload.sourceModule ?? "clinical",
            fileName: payload.fileName,
            mimeType: payload.mimeType,
            fileBase64: payload.fileBase64,
        });
        return {
            event: "file_uploaded",
            ...savedFile,
        };
    }
    async getFileMetadata(fileId, tenantId) {
        if (!tenantId) {
            throw new common_1.BadRequestException("tenantId es obligatorio");
        }
        const file = await this.storageService.getById(fileId);
        if (!file || file.tenantId !== tenantId) {
            throw new common_1.NotFoundException("Archivo no encontrado");
        }
        return file;
    }
};
exports.FileService = FileService;
exports.FileService = FileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [storage_service_1.StorageService])
], FileService);
//# sourceMappingURL=file.service.js.map