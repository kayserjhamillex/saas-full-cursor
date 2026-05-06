import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ModuleRepository } from '../repositories/module.repository';
import { ModuleService } from './module.service';

describe('ModuleService', () => {
  let service: ModuleService;
  const moduleRepository = {
    upsert: jest.fn(),
    listByTenant: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModuleService,
        { provide: ModuleRepository, useValue: moduleRepository },
      ],
    }).compile();

    service = module.get<ModuleService>(ModuleService);
  });

  it('GIVEN modulo activo WHEN validateModule THEN retorna modulo habilitado', async () => {
    moduleRepository.listByTenant.mockResolvedValue([
      { module_name: 'clinical', is_active: true },
    ]);

    const result = await service.validateModule('tenant-1', 'clinical');

    expect(result).toEqual({ moduleName: 'clinical', isActive: true });
  });

  it('GIVEN modulo deshabilitado WHEN validateModule THEN lanza Forbidden', async () => {
    moduleRepository.listByTenant.mockResolvedValue([
      { module_name: 'clinical', is_active: false },
    ]);

    await expect(
      service.validateModule('tenant-1', 'clinical'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
