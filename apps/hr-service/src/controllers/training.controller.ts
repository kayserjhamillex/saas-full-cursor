import { Body, Controller, Post } from '@nestjs/common';
import { CreateTrainingDto } from './dto/create-training.dto';
import { TrainingService } from '../services/training.service';

@Controller('trainings')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post()
  create(
    @Body()
    body: {
      tenantId?: string;
      employeeId?: string;
      title?: string;
      provider?: string;
      status?: string;
      completedAt?: string;
    },
  ) {
    return this.trainingService.createTraining(CreateTrainingDto.from(body));
  }
}
