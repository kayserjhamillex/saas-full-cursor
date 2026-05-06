import { Body, Controller, Post } from '@nestjs/common';
import { WhatsappService } from '../services/whatsapp.service';

@Controller('send')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post()
  send(
    @Body()
    body: {
      tenantId?: string;
      phoneNumber?: string;
      message?: string;
      eventType?: string;
    },
  ) {
    return this.whatsappService.sendMessage(body);
  }
}
