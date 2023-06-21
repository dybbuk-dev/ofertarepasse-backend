import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WsAuthGuard } from './ws-auth.guard';
import { ChatEntity } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';

@WebSocketGateway(3002, { cors: true, transports: ['websocket', 'polling'] })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    private readonly userService: UsersService,
  ) {}
  private connectedClients = new Map<string, string>();
  private timer = new Map<string, any>();

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Initialized');
  }

  @UseGuards(WsAuthGuard)
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    this.connectedClients.delete(client.id);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { message: string; recipientId: string; meta?: string },
  ) {
    const user = client['user'];
    const { message, recipientId, meta } = data;
    const init: boolean = meta === 'INIT';

    try {
      const sender = await this.userService.findOne({
        where: {
          id: user.id,
        },
      });
      if (!sender) {
        return;
      }
      const recipient = await this.userService.findOne({
        where: {
          id: init ? process.env.ROOT_USER : recipientId,
        },
      });
      if (!recipient) {
        return;
      }
      let chat: any;
      if (meta === 'INIT') {
        if (user.id === process.env.ROOT_USER) {
          return;
        }
        chat = this.chatRepository.create({
          message: 'Seja Bem-vindo ao suporte, como podemos ajudar você hoje?',
          sender: recipient,
          recipient: sender,
        });
      } else {
        chat = this.chatRepository.create({
          message,
          sender,
          recipient,
        });
      }
      await this.chatRepository.save(chat);
      const { sender: s, recipient: r, ...res } = chat;
      const payload = {
        ...res,
        senderId: chat.sender.id,
        recipientId: chat.recipient.id,
      };
      const recipientSocketId = this.connectedClients.get(
        init ? process.env.ROOT_USER : recipientId,
      );

      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit('message', payload);
      }
      client.emit('message', payload);

      //*********Set Online Status**************
      this.userService.setOnlineStatus(user.id, true);
      this.server.emit('online-status', { id: user.id, isOnline: true });

      // set online status using debounce
      clearTimeout(this.timer.get(user.id));
      const newTimer = setTimeout(() => {
        this.userService.setOnlineStatus(user.id, false);
        this.server.emit('online-status', { id: user.id, isOnline: false });
      }, 60000);
      this.timer.set(user.id, newTimer);
    } catch (err) {
      console.log('error', err);
      throw err;
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('enroll')
  handleChat(@ConnectedSocket() client: Socket) {
    const user = client['user'];
    this.connectedClients.set(user.id, client.id);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('read-all')
  handleReadAll(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    { recipientId }: { recipientId: string },
  ) {
    const user = client['user'];
    this.server
      .to(this.connectedClients.get(recipientId))
      .emit('read-all', { userWhoRead: user.id });
  }
}
