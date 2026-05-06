export type ImageEntity = {
  id: string;
  tenantId: string;
  patientId: string;
  encounterId: string;
  imageName: string;
  mimeType: string;
  imageBase64: string;
  createdAt: Date;
};
