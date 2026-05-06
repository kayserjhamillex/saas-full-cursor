import { Body, Controller, Patch } from '@nestjs/common';
import { UpdateModuleStatusDto } from './dto/update-module-status.dto';
import { ModuleService } from '../services/module.service';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Patch('status')
  updateStatus(
    @Body()
    body: {
      tenantId?: string;
      moduleName?: string;
      isActive?: boolean;
    },
  ) {
    return this.moduleService.updateModuleStatus(
      UpdateModuleStatusDto.from(body),
    );
  }
}
