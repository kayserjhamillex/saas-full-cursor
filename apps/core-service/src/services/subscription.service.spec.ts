import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ModuleRepository } from '../repositories/module.repository';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { TenantRepository } from '../repositories/tenant.repository';
import { SubscriptionService } from './subscription.service';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  const subscriptionRepository = {
    create: jest.fn(),
    findActiveByTenantId: jest.fn(),
    expireOverdueSubscriptions: jest.fn(),
  };
  const tenantRepository = {
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };
  const moduleRepository = {
    upsert: jest.fn(),
    disableAllByTenant: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        { provide: SubscriptionRepository, useValue: subscriptionRepository },
        { provide: TenantRepository, useValue: tenantRepository },
        { provide: ModuleRepository, useValue: moduleRepository },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
  });

  it('GIVEN durationDays invalido WHEN createSubscription THEN lanza BadRequest', async () => {
    await expect(
      service.createSubscription({
        tenantId: 'tenant-1',
        plan: 'basic',
        durationDays: 0,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('GIVEN plan pro WHEN createSubscription THEN habilita modulos del plan', async () => {
    tenantRepository.findById.mockResolvedValue({
      id: 'tenant-1',
      status: 'active',
    });
    subscriptionRepository.create.mockResolvedValue({
      id: 'sub-1',
      tenantId: 'tenant-1',
    });

    await service.createSubscription({
      tenantId: 'tenant-1',
      plan: 'pro',
      durationDays: 30,
    });

    expect(moduleRepository.upsert).toHaveBeenCalledWith(
      'tenant-1',
      'clinical',
      true,
    );
    expect(moduleRepository.upsert).toHaveBeenCalledWith(
      'tenant-1',
      'inventory',
      true,
    );
    expect(moduleRepository.upsert).toHaveBeenCalledWith(
      'tenant-1',
      'financial',
      true,
    );
  });
});
