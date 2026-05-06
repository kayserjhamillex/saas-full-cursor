export type EvaluationEntity = {
    id: string;
    tenantId: string;
    employeeId: string;
    evaluatorName: string;
    score: number;
    comments: string | null;
    evaluatedAt: Date;
};
