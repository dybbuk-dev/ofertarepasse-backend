import { ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient<Socket>();
    try {
      const token: string =
        socket.handshake.headers.authorization.split(' ')[1];
      const user = await this.validateToken(token);
      socket['user'] = user; // Attach user to the socket for later use
      return true;
    } catch (err) {
      throw err;
    }
  }

  async validateToken(token: string) {
    const payload = this.jwtService.verify(token); // Throws exception if token is invalid
    return { id: payload.id, email: payload.email }; // Return user object from token payload
  }
}
