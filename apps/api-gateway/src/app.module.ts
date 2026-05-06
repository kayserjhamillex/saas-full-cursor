import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayRequestValidationService } from './shared/services/gateway-request-validation.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev_jwt_secret_change_before_prod',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, GatewayRequestValidationService],
})
export class AppModule {}
