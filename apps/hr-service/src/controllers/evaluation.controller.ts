import { Body, Controller, Post } from '@nestjs/common';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { EvaluationService } from '../services/evaluation.service';

@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  create(
    @Body()
    body: {
      tenantId?: string;
      employeeId?: string;
      evaluatorName?: string;
      score?: number;
      comments?: string;
      evaluatedAt?: string;
    },
  ) {
    return this.evaluationService.createEvaluation(
      CreateEvaluationDto.from(body),
    );
  }
}
