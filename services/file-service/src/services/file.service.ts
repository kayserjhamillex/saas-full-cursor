import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { StorageService } from "./storage.service";

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "application/pdf",
]);
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

@Injectable()
export class FileService {
  constructor(private readonly storageService: StorageService) {}

  async uploadFile(payload: {
    tenantId?: string;
    patientId?: string;
    encounterId?: string;
    sourceModule?: string;
    fileName?: string;
    mimeType?: string;
    fileBase64?: string;
  }) {
    if (!payload.tenantId) {
      throw new BadRequestException("tenantId es obligatorio");
    }
    if (!payload.fileName) {
      throw new BadRequestException("fileName es obligatorio");
    }
    if (!payload.mimeType || !ALLOWED_MIME_TYPES.has(payload.mimeType)) {
      throw new BadRequestException("Tipo de archivo no permitido");
    }
    if (!payload.fileBase64) {
      throw new BadRequestException("fileBase64 es obligatorio");
    }

    const sizeBytes = Buffer.from(payload.fileBase64, "base64").length;
    if (sizeBytes > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        "Archivo supera el tamano maximo permitido",
      );
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

  async getFileMetadata(fileId: string, tenantId?: string) {
    if (!tenantId) {
      throw new BadRequestException("tenantId es obligatorio");
    }
    const file = await this.storageService.getById(fileId);
    if (!file || file.tenantId !== tenantId) {
      throw new NotFoundException("Archivo no encontrado");
    }
    return file;
  }
}
