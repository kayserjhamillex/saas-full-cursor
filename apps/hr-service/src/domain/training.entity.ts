export type TrainingEntity = {
  id: string;
  tenantId: string;
  employeeId: string;
  title: string;
  provider: string;
  status: string;
  completedAt: Date | null;
  createdAt: Date;
};
