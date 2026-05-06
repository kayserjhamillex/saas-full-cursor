import { FileService } from '../services/file.service';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    upload(body: {
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
    getById(fileId: string, tenantId: string | undefined): Promise<{
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
