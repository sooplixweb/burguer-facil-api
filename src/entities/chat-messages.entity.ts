import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ChatEntity } from './chat.entity';
import { UserEntity } from './user.entity';
import { ChatMessageSenderType } from 'src/dtos/enums/chat-message-sender-type.enum';

@Entity('chat_messages')
export class ChatMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  chatId: string;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chatId' })
  chat: ChatEntity;

  @Column({ type: 'uuid', nullable: true })
  senderId?: string | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'senderId' })
  sender?: UserEntity | null;

  @Column({
    type: 'enum',
    enum: ChatMessageSenderType,
    default: ChatMessageSenderType.CUSTOMER,
  })
  senderType: ChatMessageSenderType;

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
