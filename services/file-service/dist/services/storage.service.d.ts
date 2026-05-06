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
export declare class StorageService {
    private readonly storageDir;
    private readonly metadataFilePath;
    save(payload: {
        tenantId: string;
        patientId?: string;
        encounterId?: string;
        sourceModule: string;
        fileName: string;
        mimeType: string;
        fileBase64: string;
    }): Promise<StoredFileRecord>;
    getById(fileId: string): Promise<StoredFileRecord | undefined>;
    private readMetadata;
    private writeMetadata;
}
export {};
