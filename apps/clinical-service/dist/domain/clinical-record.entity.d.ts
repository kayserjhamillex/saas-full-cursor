export type ClinicalRecordEntity = {
    id: string;
    patientId: string;
    createdAt?: Date;
    deletedAt?: Date | null;
};
