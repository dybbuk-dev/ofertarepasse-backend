import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compareSync, hashSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { TypePerson } from 'src/users/enum/type.enum';
import { Status } from 'src/users/enum/status.enum';
import { randomUUID } from 'crypto';
import axios from 'axios';

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

  async createUserAfterSocial(email: string, name: string) {
    try {
      const user = await this.usersService.findOne({
        where: { email },
      });

      return {
        ...user,
        token: this.jwtService.sign({ email: user.email, id: user.id }),
      };
    } catch (err) {
      const user: any = await this.usersService.create({
        email,
        name,
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
  }

  async google(token: string) {
    try {
      await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`,
      );

      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`,
      );

      return this.createUserAfterSocial(data.email, data.name);
    } catch (err) {
      throw err; // or handle the error as you wish
    }
  }

  async facebook(token: string) {
    try {
      const { data: dataVerify } = await axios.get(
        `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`,
      );
      if (dataVerify.data.error) {
        throw dataVerify.data.error.message;
      }

      const { data } = await axios.get(
        `https://graph.facebook.com/me?fields=name,email&access_token=${token}`,
      );

      return this.createUserAfterSocial(data.email, data.name);
    } catch (err) {
      throw err;
    }
  }

  async generateToken(email: string) {
    return this.jwtService.sign(
      { email },
      { secret: process.env.JWT_SECRET_EMAIL, expiresIn: '10m' },
    );
  }

  async changePassword(token: string, password: string) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_EMAIL,
      });

      const tokenDecode: any = this.jwtService.decode(token);

      const user = await this.usersService.findOne({
        where: { email: tokenDecode.email },
      });

      await this.usersService.update(user.id, {
        password: hashSync(password, 10),
      });
    } catch (err) {
      return Error('Token inválido');
    }
  }
}
