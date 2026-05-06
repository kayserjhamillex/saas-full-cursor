export type AttendanceEntity = {
    id: string;
    tenantId: string;
    employeeId: string;
    checkInAt: Date;
    checkOutAt: Date | null;
    status: string;
    notes: string | null;
    createdAt: Date;
};
