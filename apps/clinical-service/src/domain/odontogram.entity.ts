export type OdontogramEntity = {
  id: string;
  patientId: string;
  chartData: Record<string, unknown>;
  updatedAt?: Date;
};
