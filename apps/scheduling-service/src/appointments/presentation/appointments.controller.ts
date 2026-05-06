import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from '../application/appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { GetAppointmentQueryDto } from './dto/get-appointment-query.dto';

@Controller()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('appointments')
  @HttpCode(HttpStatus.CREATED)
  createAppointment(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      professionalId?: string;
      scheduledAt?: string;
      durationMinutes?: number;
    },
  ) {
    return this.appointmentsService.createAppointment(
      CreateAppointmentDto.from(body),
    );
  }

  @Get('appointments/:appointmentId')
  getAppointment(
    @Param('appointmentId') appointmentId: string,
    @Query('tenantId') tenantId: string | undefined,
  ) {
    const query = GetAppointmentQueryDto.from({ appointmentId, tenantId });
    return this.appointmentsService.getAppointment(
      query.appointmentId,
      query.tenantId,
    );
  }
}
