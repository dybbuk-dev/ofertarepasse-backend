import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: AuthLoginDto) {
    return this.authService.login(body);
  }

  @Post('google')
  async google(@Body('credencial') credencial: string) {
    return this.authService.google(credencial);
  }
}
