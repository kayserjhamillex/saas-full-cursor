import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Body() body: { email?: string; password?: string; tenantId?: string },
  ) {
    return this.authService.login(LoginDto.from(body));
  }
}
