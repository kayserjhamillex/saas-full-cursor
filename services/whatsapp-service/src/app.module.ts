import { Module } from '@nestjs/common';
import { WhatsappController } from './controllers/whatsapp.controller';
import { InternalServiceTokenGuard } from './guards/internal-service-token.guard';
import { WhatsappService } from './services/whatsapp.service';

@Module({
  imports: [],
  controllers: [WhatsappController],
  providers: [WhatsappService, InternalServiceTokenGuard],
})
export class AppModule {}
