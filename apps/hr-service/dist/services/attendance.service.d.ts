import { HrRepository } from '../repositories/hr.repository';
export declare class AttendanceService {
    private readonly hrRepository;
    constructor(hrRepository: HrRepository);
    registerAttendance(payload: {
        tenantId?: string;
        employeeId?: string;
        checkInAt?: string;
        checkOutAt?: string;
        status?: string;
        notes?: string;
    }): Promise<{
        attendance: import("../domain/attendance.entity").AttendanceEntity;
        event: string;
    }>;
}
