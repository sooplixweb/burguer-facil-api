import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import {
  AlterStatusDto,
  OrderRequestDto,
} from 'src/dtos/request/order-request.dto';
import { OrderResponseDto } from 'src/dtos/response/orders-response.dto';
import { OrdersService } from 'src/services/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() dto: OrderRequestDto): Promise<OrderResponseDto> {
    return await this.ordersService.create(dto);
  }

  @Get('find-all')
  async findAll(): Promise<OrderResponseDto[]> {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<OrderResponseDto> {
    return await this.ordersService.findById(id);
  }

  @Patch(':id')
  async alterStatus(
    @Param('id') id: string,
    @Body() status: AlterStatusDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.alterStatus(id, status);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
