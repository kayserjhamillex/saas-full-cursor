export type AiResultEntity = {
  id: string;
  imageId: string;
  encounterId: string;
  finding: string;
  confidence: number;
  riskLevel: string;
  recommendations: string[];
  processingMs: number;
  modelType: string;
  createdAt: Date;
};
