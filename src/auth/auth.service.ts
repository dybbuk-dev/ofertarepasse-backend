import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: AuthLoginDto) {
    if (user.email && user.password) {
      const verifyUser = await this.validateUser(user.email, user.password);

      if (!verifyUser) {
        return {
          error: true,
          message: 'Email or password invalid',
        };
      }

      return {
        ...verifyUser,
        token: this.jwtService.sign({ email: user.email }),
      };
    }

    return {
      error: true,
      message: 'Email or password invalid',
    };
  }

  async validateUser(email: string, password: string) {
    const { error, user: userData } = await this.usersService.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });

    if (!error) {
      const isPasswordValid = compareSync(password, userData.password);

      if (!isPasswordValid) return null;

      const { user } = await this.usersService.findOne({
        where: {
          email,
        },
      });

      return user;
    } else {
      return false;
    }
  }
}
