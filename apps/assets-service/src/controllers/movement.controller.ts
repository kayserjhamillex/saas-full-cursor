import { Body, Controller, Post } from "@nestjs/common";
import { RegisterMovementDto } from "./dto/register-movement.dto";
import { MovementService } from "../services/movement.service";

@Controller("movements")
export class MovementController {
  constructor(private readonly movementService: MovementService) {}

  @Post()
  registerMovement(
    @Body()
    body: {
      tenantId?: string;
      assetId?: string;
      movementType?: string;
      fromLocation?: string;
      toLocation?: string;
      notes?: string;
    },
  ) {
    return this.movementService.registerMovement(
      RegisterMovementDto.from(body),
    );
  }
}
