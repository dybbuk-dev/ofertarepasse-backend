import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { OAuth2Client } from 'google-auth-library';
import { TypePerson } from 'src/users/enum/type.enum';
import { Status } from 'src/users/enum/status.enum';
import { randomUUID } from 'crypto';

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
          message: 'Email ou senha inválido',
        };
      }

      return {
        ...verifyUser,
        token: this.jwtService.sign({ email: user.email, id: verifyUser.id }),
      };
    }

    return {
      error: true,
      message: 'Email ou senha inválido',
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

  async google(credencial: string) {
    const client = new OAuth2Client(process.env.GOOGLE_AUTH_AUDIENCE);

    const ticket = await client.verifyIdToken({
      idToken: credencial,
      audience: process.env.GOOGLE_AUTH_AUDIENCE,
    });

    const payload = ticket.getPayload();

    try {
      const user = await this.usersService.findOne({
        where: { email: payload.email },
      });

      return {
        ...user,
        token: this.jwtService.sign({ email: user.email, id: user.id }),
      };
    } catch (err) {
      const user: any = await this.usersService.create({
        email: payload.email,
        name: payload.name,
        password: randomUUID().split('-')[0],
        type: TypePerson.prysical,
        image: null,
        status: Status.active,
      });

      return {
        ...user,
        token: this.jwtService.sign({ email: user.email, id: user.id }),
      };
    }

    // return {
    //   ...user,
    //   token: this.jwtService.sign({ email: user.email, id: verifyUser.id })
    // }
  }
}
