import { Module } from '@nestjs/common';
import { EmailController } from './controllers/email.controller';
import { InternalServiceTokenGuard } from './guards/internal-service-token.guard';
import { EmailService } from './services/email.service';
import { NotificationQueueService } from './services/notification-queue.service';
import { TemplateService } from './services/template.service';

@Module({
  imports: [],
  controllers: [EmailController],
  providers: [
    EmailService,
    TemplateService,
    NotificationQueueService,
    InternalServiceTokenGuard,
  ],
})
export class AppModule {}
