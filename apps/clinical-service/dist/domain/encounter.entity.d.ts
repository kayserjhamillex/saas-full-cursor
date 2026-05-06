export type EncounterEntity = {
    id: string;
    recordId: string;
    encounterDate: Date;
    notes: string;
    createdAt?: Date;
    deletedAt?: Date | null;
};
