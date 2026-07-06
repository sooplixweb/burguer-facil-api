import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRole } from 'src/dtos/enums/user-role.enum';
import { ChatMessageRequestDto } from 'src/dtos/request/chat-message-request.dto';
import { ChatRequestDto } from 'src/dtos/request/chat-request.dto';
import { ChatMessageResponseDto } from 'src/dtos/response/chat-message-response.dto';
import { ChatResponseDto } from 'src/dtos/response/chat-response.dto';
import { ChatService } from 'src/services/chat.service';

type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
};

type AuthenticatedRequest = ExpressRequest & {
  user: AuthenticatedUser;
};

@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(
    @Body() dto: ChatRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ChatResponseDto> {
    return this.chatService.create(dto, req.user);
  }

  @Get('find-all')
  findAll(@Req() req: AuthenticatedRequest): Promise<ChatResponseDto[]> {
    return this.chatService.findAll(req.user);
  }

  @Get('order/:orderId')
  findByOrderId(
    @Param('orderId') orderId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ChatResponseDto> {
    return this.chatService.findByOrderId(orderId, req.user);
  }

  @Post('messages')
  createMessage(
    @Body() dto: ChatMessageRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ChatMessageResponseDto> {
    return this.chatService.createMessage(dto, req.user);
  }

  @Get(':id/messages')
  findMessages(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ChatMessageResponseDto[]> {
    return this.chatService.findMessages(id, req.user);
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ChatResponseDto> {
    return this.chatService.findById(id, req.user);
  }
}
