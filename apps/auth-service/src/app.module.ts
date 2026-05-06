import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { InternalServiceTokenGuard } from './guards/internal-service-token.guard';

@Module({
  imports: [AuthModule],
  providers: [InternalServiceTokenGuard],
})
export class AppModule {}
