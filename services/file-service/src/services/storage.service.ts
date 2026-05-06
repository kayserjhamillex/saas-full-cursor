import { Injectable } from "@nestjs/common";
import { mkdir, readFile, writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import { join } from "path";

type StoredFileRecord = {
  id: string;
  tenantId: string;
  patientId?: string;
  encounterId?: string;
  sourceModule: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  url: string;
};

@Injectable()
export class StorageService {
  private readonly storageDir =
    process.env.STORAGE_DATA_DIR?.trim() || "data/files";
  private readonly metadataFilePath = join(this.storageDir, "metadata.json");

  async save(payload: {
    tenantId: string;
    patientId?: string;
    encounterId?: string;
    sourceModule: string;
    fileName: string;
    mimeType: string;
    fileBase64: string;
  }): Promise<StoredFileRecord> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const buffer = Buffer.from(payload.fileBase64, "base64");
    const record: StoredFileRecord = {
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

  async getById(fileId: string): Promise<StoredFileRecord | undefined> {
    const allMetadata = await this.readMetadata();
    return allMetadata[fileId];
  }

  private async readMetadata(): Promise<Record<string, StoredFileRecord>> {
    await mkdir(this.storageDir, { recursive: true });
    try {
      const raw = await readFile(this.metadataFilePath, "utf-8");
      const parsed = JSON.parse(raw) as unknown;
      if (!parsed || typeof parsed !== "object") {
        return {};
      }
      return parsed as Record<string, StoredFileRecord>;
    } catch {
      return {};
    }
  }

  private async writeMetadata(
    metadata: Record<string, StoredFileRecord>,
  ): Promise<void> {
    await writeFile(
      this.metadataFilePath,
      JSON.stringify(metadata, null, 2),
      "utf-8",
    );
  }
}
