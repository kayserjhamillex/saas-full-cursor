export type PatientEntity = {
  id: string;
  tenantId: string;
  name: string;
  document: string;
  birthDate: Date;
  createdAt?: Date;
  deletedAt?: Date | null;
};
