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
        token: this.jwtService.sign({ email: user.email, id: verifyUser.id }),
      };
    }

    return {
      error: true,
      message: 'Email or password invalid',
    };
  }

  async validateUser(email: string, password: string) {
    const userFind = await this.usersService.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });

    const isPasswordValid = compareSync(password, userFind.password);

    if (!isPasswordValid) return null;

    const user = await this.usersService.findOne({
      where: {
        email,
      },
    });

    return user;
  }
}
