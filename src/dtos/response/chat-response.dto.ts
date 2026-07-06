import { Expose, Type } from 'class-transformer';
import { ChatMessageResponseDto } from './chat-message-response.dto';

export class ChatResponseDto {
  @Expose()
  id: string;

  @Expose()
  orderId: string;

  @Expose()
  @Type(() => ChatMessageResponseDto)
  messages: ChatMessageResponseDto[];

  @Expose()
  createdAt: Date;
}
