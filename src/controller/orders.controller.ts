import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from 'src/dtos/enums/user-role.enum';
import {
  AlterStatusDto,
  OrderRequestDto,
} from 'src/dtos/request/order-request.dto';
import { OrderResponseDto } from 'src/dtos/response/orders-response.dto';
import { OrdersService } from 'src/services/orders.service';
import type { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
};
type AuthenticatedRequest = ExpressRequest & {
  user: AuthenticatedUser;
};
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: OrderRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<OrderResponseDto> {
    return await this.ordersService.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('find-all')
  async findAll(@Req() req: AuthenticatedRequest): Promise<OrderResponseDto[]> {
    return await this.ordersService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<OrderResponseDto> {
    return await this.ordersService.findById(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async alterStatus(
    @Param('id') id: string,
    @Body() status: AlterStatusDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<OrderResponseDto> {
    return this.ordersService.alterStatus(id, status, req.user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
