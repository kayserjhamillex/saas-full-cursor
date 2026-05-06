"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("fs/promises");
const crypto_1 = require("crypto");
const path_1 = require("path");
let StorageService = class StorageService {
    storageDir = process.env.STORAGE_DATA_DIR?.trim() || "data/files";
    metadataFilePath = (0, path_1.join)(this.storageDir, "metadata.json");
    async save(payload) {
        const id = (0, crypto_1.randomUUID)();
        const createdAt = new Date().toISOString();
        const buffer = Buffer.from(payload.fileBase64, "base64");
        const record = {
            id,
            tenantId: payload.tenantId,
            patientId: payload.patientId,
            encounterId: payload.encounterId,
            sourceModule: payload.sourceModule,
            fileName: payload.fileName,
            mimeType: payload.mimeType,
            sizeBytes: buffer.length,
            createdAt,
            url: `https://files.local/${payload.tenantId}/${id}/${encodeURIComponent(payload.fileName)}`,
        };
        const allMetadata = await this.readMetadata();
        allMetadata[id] = record;
        await this.writeMetadata(allMetadata);
        return record;
    }
    async getById(fileId) {
        const allMetadata = await this.readMetadata();
        return allMetadata[fileId];
    }
    async readMetadata() {
        await (0, promises_1.mkdir)(this.storageDir, { recursive: true });
        try {
            const raw = await (0, promises_1.readFile)(this.metadataFilePath, "utf-8");
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== "object") {
                return {};
            }
            return parsed;
        }
        catch {
            return {};
        }
    }
    async writeMetadata(metadata) {
        await (0, promises_1.writeFile)(this.metadataFilePath, JSON.stringify(metadata, null, 2), "utf-8");
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)()
], StorageService);
//# sourceMappingURL=storage.service.js.map