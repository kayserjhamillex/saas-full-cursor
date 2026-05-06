import { Body, Controller, Get, Param, Query, Post } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { GetPatientQueryDto } from './dto/get-patient-query.dto';
import { PatientService } from '../services/patient.service';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  createPatient(
    @Body()
    body: {
      tenantId?: string;
      name?: string;
      document?: string;
      birthDate?: string;
    },
  ) {
    return this.patientService.createPatient(CreatePatientDto.from(body));
  }

  @Get(':patientId')
  getPatient(
    @Param('patientId') patientId: string,
    @Query('tenantId') tenantId: string | undefined,
  ) {
    const query = GetPatientQueryDto.from({ patientId, tenantId });
    return this.patientService.getPatient(query.tenantId, query.patientId);
  }
}
