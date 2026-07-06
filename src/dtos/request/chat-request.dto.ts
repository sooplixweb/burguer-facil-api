import { IsNotEmpty, IsUUID } from 'class-validator';

export class ChatRequestDto {
  @IsNotEmpty()
  @IsUUID()
  orderId: string;
}
