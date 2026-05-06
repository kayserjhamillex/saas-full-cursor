import { Body, Controller, Post } from "@nestjs/common";
import { AssignAssetDto } from "./dto/assign-asset.dto";
import { AssignmentService } from "../services/assignment.service";

@Controller("assignments")
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  assignAsset(
    @Body()
    body: {
      tenantId?: string;
      assetId?: string;
      employeeId?: string;
      areaName?: string;
      notes?: string;
    },
  ) {
    return this.assignmentService.assignAsset(AssignAssetDto.from(body));
  }
}
