import { StorageService } from "./storage.service";
export declare class FileService {
    private readonly storageService;
    constructor(storageService: StorageService);
    uploadFile(payload: {
        tenantId?: string;
        patientId?: string;
        encounterId?: string;
        sourceModule?: string;
        fileName?: string;
        mimeType?: string;
        fileBase64?: string;
    }): Promise<{
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
        event: string;
    }>;
    getFileMetadata(fileId: string, tenantId?: string): Promise<{
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
    }>;
}
