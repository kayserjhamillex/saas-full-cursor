import { Body, Controller, Post } from "@nestjs/common";
import { RegisterDepreciationDto } from "./dto/register-depreciation.dto";
import { DepreciationService } from "../services/depreciation.service";

@Controller("depreciation")
export class DepreciationController {
  constructor(private readonly depreciationService: DepreciationService) {}

  @Post()
  registerDepreciation(
    @Body()
    body: {
      tenantId?: string;
      assetId?: string;
      periodLabel?: string;
      amount?: number;
      method?: string;
      financialAccountId?: string;
      notes?: string;
    },
  ) {
    return this.depreciationService.registerDepreciation(
      RegisterDepreciationDto.from(body),
    );
  }
}
