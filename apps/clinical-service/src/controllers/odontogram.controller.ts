import { Body, Controller, Post } from '@nestjs/common';
import { UpdateOdontogramDto } from './dto/update-odontogram.dto';
import { ClinicalService } from '../services/clinical.service';

@Controller('odontograms')
export class OdontogramController {
  constructor(private readonly clinicalService: ClinicalService) {}

  @Post()
  updateOdontogram(
    @Body()
    body: {
      tenantId?: string;
      patientId?: string;
      chartData?: Record<string, unknown>;
    },
  ) {
    return this.clinicalService.updateOdontogram(
      UpdateOdontogramDto.from(body),
    );
  }
}
