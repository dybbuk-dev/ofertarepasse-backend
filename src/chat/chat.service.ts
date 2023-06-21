import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { ChatEntity } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async loadCurrentChat(senderId: string, recipientId: string) {
    const [items, count] = await this.chatRepository.findAndCount({
      where: {
        sender: In([senderId, recipientId]),
        recipient: In([senderId, recipientId]),
      },
      order: {
        createdAt: 'ASC',
      },
      relations: ['sender', 'recipient'],
    });
    let user = {};
    if (items.length) {
      const { id, image, name, isOnline } =
        senderId === items[0].recipient.id
          ? items[0].sender
          : items[0].recipient;
      user = { id, image, name, isOnline };
    }
    return {
      items: items.map(({ sender, recipient, ...res }) => ({
        ...res,
        senderId: sender.id,
        recipientId: recipient.id,
      })),
      user,
      count,
    };
  }

  async loadChatHistory(userId: string) {
    const [items, count] = await this.chatRepository.findAndCount({
      where: [
        {
          sender: userId,
        },
        { recipient: userId },
      ],
      order: {
        createdAt: 'ASC',
      },
      relations: ['sender', 'recipient'],
    });
    const payload: any = {};
    for (const item of items) {
      if (item.sender.id === userId) {
        payload[item.recipient.id] = {
          userid: item.recipient.id,
          username: item.recipient.name,
          lastMsg: item.message,
          lastMsgTime: item.createdAt,
          isOnline: item.recipient.isOnline,
          avatar: item.recipient.image,
          newMsgCount: payload[item.recipient.id]?.newMsgCount ?? 0,
        };
      } else {
        payload[item.sender.id] = {
          userid: item.sender.id,
          username: item.sender.name,
          lastMsg: item.message,
          lastMsgTime: item.createdAt,
          isOnline: item.sender.isOnline,
          avatar: item.sender.image,
          newMsgCount: !item.isRead
            ? (payload[item.sender.id]?.newMsgCount ?? 0) + 1
            : 0,
        };
      }
    }
    return {
      items:
        Object.values(payload)?.sort(
          (a: any, b: any) =>
            new Date(b.lastMsgTime).getTime() -
            new Date(a.lastMsgTime).getTime(),
        ) ?? [],
    };
  }

  async readAll(userId: string, recId: string) {
    try {
      const updatedResults = await this.chatRepository.update(
        {
          sender: {
            id: recId,
          },
          recipient: {
            id: userId,
          },
          isRead: false,
        },
        {
          isRead: true,
        },
      );
      return {
        affectedRecords: updatedResults.affected,
      };
    } catch (err) {
      console.log('error', err);
      throw err;
    }
  }

  async getNewMessageCount(userId: string) {
    try {
      const count = await this.chatRepository.count({
        where: {
          recipient: {
            id: userId,
          },
          isRead: false,
        },
      });
      return {
        newMessageCount: count,
      };
    } catch (err) {
      console.log('get new message count error', err);
      throw err;
    }
  }
}
