import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChatMessageRequestDto {
  @IsNotEmpty()
  @IsUUID()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
