import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';
import { ChatMessageSenderType } from '../enums/chat-message-sender-type.enum';

export class ChatMessageResponseDto {
  @Expose()
  id: string;

  @Expose()
  chatId: string;

  @Expose()
  senderId?: string | null;

  @Expose()
  senderType: ChatMessageSenderType;

  @Expose()
  @Type(() => UserResponseDto)
  sender?: UserResponseDto | null;

  @Expose()
  text: string;

  @Expose()
  createdAt: Date;
}
