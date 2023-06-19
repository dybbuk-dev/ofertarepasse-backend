import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getChatHistroy(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.chatService.loadChatHistory(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/:recId')
  getCurrentChat(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('recId', new ParseUUIDPipe()) recId: string,
  ) {
    return this.chatService.loadCurrentChat(id, recId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('readAll/:id/:recId')
  readAllById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('recId', new ParseUUIDPipe()) recId: string,
  ) {
    return this.chatService.readAll(id, recId);
  }
}
