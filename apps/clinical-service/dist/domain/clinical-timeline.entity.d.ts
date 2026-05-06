export type ClinicalTimelineEntity = {
    id: string;
    patientId: string;
    eventType: string;
    referenceId: string;
    description: string;
    eventDate: Date;
};
