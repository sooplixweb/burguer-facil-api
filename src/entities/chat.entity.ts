import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { ChatMessageEntity } from './chat-messages.entity';

@Entity('chats')
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orderId: string;

  @OneToOne(() => OrderEntity, (order) => order.chat)
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @OneToMany(() => ChatMessageEntity, (message) => message.chat)
  messages: ChatMessageEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
