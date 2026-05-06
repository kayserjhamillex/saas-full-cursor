export type PayrollEntity = {
  id: string;
  tenantId: string;
  employeeId: string;
  periodLabel: string;
  baseAmount: number;
  bonusAmount: number;
  deductionAmount: number;
  netAmount: number;
  status: string;
  generatedAt: Date;
};
