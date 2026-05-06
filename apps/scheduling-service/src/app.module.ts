import { Module } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { InternalServiceTokenGuard } from './guards/internal-service-token.guard';

@Module({
  imports: [AppointmentsModule],
  providers: [InternalServiceTokenGuard],
})
export class AppModule {}
