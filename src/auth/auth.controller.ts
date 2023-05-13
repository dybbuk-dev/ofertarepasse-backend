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
  async google(@Body('token') token: string) {
    return this.authService.google(token);
  }

  @Post('facebook')
  async facebook(@Body('token') token: string) {
    return this.authService.facebook(token);
  }

  @Post('tokenEmail')
  async generateToken(@Body('email') email: string) {
    return this.authService.generateToken(email);
  }

  @Post('changePassword')
  async changePassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.changePassword(token, password);
  }
}
