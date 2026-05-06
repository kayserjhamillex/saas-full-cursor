import { Body, Controller, Post } from "@nestjs/common";
import { CreateAssetDto } from "./dto/create-asset.dto";
import { AssetService } from "../services/asset.service";

@Controller("assets")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  createAsset(
    @Body()
    body: {
      tenantId?: string;
      categoryId?: string;
      code?: string;
      name?: string;
      description?: string;
      acquisitionDate?: string;
      acquisitionCost?: number;
      usefulLifeMonths?: number;
      currentValue?: number;
      status?: string;
    },
  ) {
    return this.assetService.createAsset(CreateAssetDto.from(body));
  }
}
