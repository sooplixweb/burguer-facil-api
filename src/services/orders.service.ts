import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/entities/order.entity';
import { AlterStatusDto, OrderRequestDto } from 'src/dtos/request/order-request.dto';
import { OrderResponseDto } from 'src/dtos/response/orders-response.dto';
import { plainToInstance } from 'class-transformer';
import { OrderStatusEnum } from 'src/dtos/enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repo: Repository<OrderEntity>,
  ) {}

  async create(dto: OrderRequestDto): Promise<OrderResponseDto> {
    const order = this.repo.create(dto);
    order.history = [
      {
        status: OrderStatusEnum.RECEIVED,
        label: 'Pedido recebido',
        createdAt: new Date().toISOString(),
      },
    ];
    await this.repo.save(order);

    return plainToInstance(OrderResponseDto, order);
  }

  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.repo.find();
    return plainToInstance(OrderResponseDto, orders);
  }

  async findById(id: string): Promise<OrderResponseDto> {
    const order = await this.repo.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return plainToInstance(OrderResponseDto, order);
  }

async alterStatus(
  id: string,
  status: AlterStatusDto,
): Promise<OrderResponseDto> {
  const order = await this.repo.findOne({
    where: { id },
  });

  if (!order) {
    throw new NotFoundException('Pedido não encontrado');
  }

  if (status.status === OrderStatusEnum.RECEIVED && order.status !== OrderStatusEnum.PREPARING) {
    order.status = OrderStatusEnum.PREPARING;
    order.history = [
      ...(order.history ?? []),
      {
        status: OrderStatusEnum.PREPARING,
        label: 'Pedido em preparação',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  if (status.status === OrderStatusEnum.PREPARING && order.status !== OrderStatusEnum.ON_ROUTE) {
    order.status = OrderStatusEnum.ON_ROUTE;
    order.history = [
      ...(order.history ?? []),
      {
        status: OrderStatusEnum.ON_ROUTE,
        label: 'Pedido em rota',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  if (status.status === OrderStatusEnum.ON_ROUTE && order.status !== OrderStatusEnum.DELIVERED) {
    order.status = OrderStatusEnum.DELIVERED;
    order.history = [
      ...(order.history ?? []),
      {
        status: OrderStatusEnum.DELIVERED,
        label: 'Pedido entregue',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  const data = await this.repo.save(order);

  return plainToInstance(OrderResponseDto, data);
}

  // async update(id: string, dto: UpdateProductDto) {
  //   const product = await this.findOne(id);

  //   Object.assign(product, dto);
  //   return this.repo.save(product);
  // }

  async remove(id: string) {
    const product = await this.repo.find({ where: { id } });
    await this.repo.remove(product);

    return { message: 'Produto removido com sucesso' };
  }
}
