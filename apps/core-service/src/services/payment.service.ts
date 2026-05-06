import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { TenantRepository } from '../repositories/tenant.repository';
import { ModuleRepository } from '../repositories/module.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly moduleRepository: ModuleRepository,
  ) {}

  async registerPayment(payload: {
    tenantId?: string;
    amount?: number;
    status?: 'paid' | 'pending' | 'failed';
    extensionDays?: number;
  }) {
    const tenantId = payload.tenantId?.trim();
    const amount = payload.amount ?? 0;
    const status = payload.status ?? 'paid';
    const extensionDays = payload.extensionDays ?? 30;

    if (!tenantId || amount <= 0) {
      throw new BadRequestException('tenantId y amount valido son obligatorios');
    }

    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant no encontrado');
    }

    const payment = await this.paymentRepository.create(tenantId, amount, status);
    if (status === 'paid') {
      const extensionDate = new Date(Date.now() + extensionDays * 24 * 60 * 60 * 1000);
      await this.subscriptionRepository.reactivateLatest(tenantId, extensionDate);
      await this.tenantRepository.updateStatus(tenantId, 'active');

      const modules = await this.moduleRepository.listByTenant(tenantId);
      for (const module of modules) {
        await this.moduleRepository.upsert(tenantId, module.module_name, true);
      }
    }

    return {
      ...payment,
      event: 'payment_received',
    };
  }
}
