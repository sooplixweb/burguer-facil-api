import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessageRequestDto } from 'src/dtos/request/chat-message-request.dto';
import { ChatRequestDto } from 'src/dtos/request/chat-request.dto';
import { ChatMessageSenderType } from 'src/dtos/enums/chat-message-sender-type.enum';
import { ChatMessageResponseDto } from 'src/dtos/response/chat-message-response.dto';
import { ChatResponseDto } from 'src/dtos/response/chat-response.dto';
import { UserRole } from 'src/dtos/enums/user-role.enum';
import { ChatMessageEntity } from 'src/entities/chat-messages.entity';
import { ChatEntity } from 'src/entities/chat.entity';
import { OrderEntity } from 'src/entities/order.entity';
import { toResponse } from 'src/utils/transform-response';
import { Repository } from 'typeorm';

type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
};

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepo: Repository<ChatEntity>,
    @InjectRepository(ChatMessageEntity)
    private readonly messageRepo: Repository<ChatMessageEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

  async create(
    dto: ChatRequestDto,
    user: AuthenticatedUser,
  ): Promise<ChatResponseDto> {
    const order = await this.findOrderById(dto.orderId, user);
    const currentChat = await this.chatRepo.findOne({
      where: { orderId: order.id },
      relations: { messages: { sender: true } },
    });

    if (currentChat) {
      return this.toChatResponse(currentChat);
    }

    const chat = this.chatRepo.create({
      orderId: order.id,
      order,
      messages: [],
    });

    const savedChat = await this.chatRepo.save(chat);

    const chatMessage = this.messageRepo.create({
      chatId: savedChat.id,
      senderId: null,
      senderType: ChatMessageSenderType.SYSTEM,
      text: 'Olá! Se precisar falar com a loja durante o pedido, envie por aqui.',
    });
    const savedMessage = await this.messageRepo.save(chatMessage);
    const messageWithSender = await this.messageRepo.findOne({
      where: { id: savedMessage.id },
      relations: { sender: true },
    });

    if ('chatId' in order) {
      await this.orderRepo.update(order.id, { chatId: savedChat.id });
    }

    savedChat.messages = [messageWithSender ?? savedMessage];

    return this.toChatResponse(savedChat);
  }

  async findAll(user: AuthenticatedUser): Promise<ChatResponseDto[]> {
    const where =
      user.role === UserRole.ADMIN ? {} : { order: { userId: user.id } };

    const chats = await this.chatRepo.find({
      where,
      relations: { order: true, messages: { sender: true } },
      order: { createdAt: 'DESC' },
    });

    return toResponse(ChatResponseDto, this.sortChatMessages(chats));
  }

  async findById(
    id: string,
    user: AuthenticatedUser,
  ): Promise<ChatResponseDto> {
    const chat = await this.findChatById(id, user);

    return this.toChatResponse(chat);
  }

  async findByOrderId(
    orderId: string,
    user: AuthenticatedUser,
  ): Promise<ChatResponseDto> {
    const where =
      user.role === UserRole.ADMIN
        ? { orderId }
        : { orderId, order: { userId: user.id } };

    const chat = await this.chatRepo.findOne({
      where,
      relations: { order: true, messages: { sender: true } },
    });

    if (!chat) {
      throw new NotFoundException('Chat não encontrado');
    }

    return this.toChatResponse(chat);
  }

  async createMessage(
    dto: ChatMessageRequestDto,
    user: AuthenticatedUser,
  ): Promise<ChatMessageResponseDto> {
    const text = dto.text.trim();

    if (!text) {
      throw new BadRequestException('Mensagem não pode ser vazia');
    }

    const chat = await this.findChatById(dto.chatId, user);
    const message = this.messageRepo.create({
      chatId: chat.id,
      senderId: user.id,
      senderType:
        user.role === UserRole.ADMIN
          ? ChatMessageSenderType.ADMIN
          : ChatMessageSenderType.CUSTOMER,
      text,
    });
    const savedMessage = await this.messageRepo.save(message);
    const messageWithSender = await this.messageRepo.findOne({
      where: { id: savedMessage.id },
      relations: { sender: true },
    });

    return this.toMessageResponse(messageWithSender ?? savedMessage);
  }

  async findMessages(
    chatId: string,
    user: AuthenticatedUser,
  ): Promise<ChatMessageResponseDto[]> {
    const chat = await this.findChatById(chatId, user);

    return toResponse(
      ChatMessageResponseDto,
      this.sortMessages(chat.messages ?? []),
    );
  }

  private async findOrderById(
    id: string,
    user: AuthenticatedUser,
  ): Promise<OrderEntity> {
    const where =
      user.role === UserRole.ADMIN ? { id } : { id, userId: user.id };

    const order = await this.orderRepo.findOne({ where });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  private async findChatById(
    id: string,
    user: AuthenticatedUser,
  ): Promise<ChatEntity> {
    const where =
      user.role === UserRole.ADMIN
        ? { id }
        : { id, order: { userId: user.id } };

    const chat = await this.chatRepo.findOne({
      where,
      relations: { order: true, messages: { sender: true } },
    });

    if (!chat) {
      throw new NotFoundException('Chat não encontrado');
    }

    return chat;
  }

  private sortChatMessages(chats: ChatEntity[]): ChatEntity[] {
    return chats.map((chat) => ({
      ...chat,
      messages: this.sortMessages(chat.messages ?? []),
    }));
  }

  private sortMessages(messages: ChatMessageEntity[]): ChatMessageEntity[] {
    return [...messages].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
  }

  private toChatResponse(chat: ChatEntity): ChatResponseDto {
    return toResponse(ChatResponseDto, {
      ...chat,
      messages: this.sortMessages(chat.messages ?? []),
    });
  }

  private toMessageResponse(
    message: ChatMessageEntity,
  ): ChatMessageResponseDto {
    return toResponse(ChatMessageResponseDto, message);
  }
}
