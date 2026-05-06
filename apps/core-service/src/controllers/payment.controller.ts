import { Body, Controller, Post } from '@nestjs/common';
import { RegisterPaymentDto } from './dto/register-payment.dto';
import { PaymentService } from '../services/payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  registerPayment(
    @Body()
    body: {
      tenantId?: string;
      amount?: number;
      status?: 'paid' | 'pending' | 'failed';
      extensionDays?: number;
    },
  ) {
    return this.paymentService.registerPayment(RegisterPaymentDto.from(body));
  }
}
