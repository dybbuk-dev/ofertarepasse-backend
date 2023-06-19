import { IsNotEmpty } from 'class-validator';
import { ChatEntity } from '../entities/chat.entity';

export class CreateChatDto {
  @IsNotEmpty()
  sender: ChatEntity['sender'];

  @IsNotEmpty()
  recipient: ChatEntity['recipient'];

  @IsNotEmpty()
  message: ChatEntity['message'];
}
