export type PrescriptionEntity = {
    id: string;
    encounterId: string;
    medication: string;
    dosage: string;
    instructions: string;
    createdAt?: Date;
};
