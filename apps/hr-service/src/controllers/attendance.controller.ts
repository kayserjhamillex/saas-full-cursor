import { Body, Controller, Post } from '@nestjs/common';
import { RegisterAttendanceDto } from './dto/register-attendance.dto';
import { AttendanceService } from '../services/attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  register(
    @Body()
    body: {
      tenantId?: string;
      employeeId?: string;
      checkInAt?: string;
      checkOutAt?: string;
      status?: string;
      notes?: string;
    },
  ) {
    return this.attendanceService.registerAttendance(
      RegisterAttendanceDto.from(body),
    );
  }
}
