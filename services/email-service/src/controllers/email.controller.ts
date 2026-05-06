import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from '../services/email.service';

@Controller('send')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  send(
    @Body()
    body: {
      tenantId?: string;
      to?: string;
      subject?: string;
      template?: string;
      variables?: Record<string, unknown>;
    },
  ) {
    return this.emailService.sendEmail(body);
  }
}
