import { Body, Controller, Patch, Post } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionService } from '../services/subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  createSubscription(
    @Body() body: { tenantId?: string; plan?: string; durationDays?: number },
  ) {
    return this.subscriptionService.createSubscription(
      CreateSubscriptionDto.from(body),
    );
  }

  @Patch('expire-overdue')
  expireOverdue() {
    return this.subscriptionService.expireOverdueSubscriptions();
  }
}
