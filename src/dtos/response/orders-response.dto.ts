import { OrderStatusEnum } from 'src/dtos/enums/order-status.enum';
import { PaymentMethodEnum } from 'src/dtos/enums/payment-method.enum';
import { OrderItem } from 'src/types/order-Item-type';
import { UserResponseDto } from './user-response.dto';
import { AddressResponseDto } from './address-response.dto';

type OrderHistory = {
  status: OrderStatusEnum;
  label: string;
  time?: string;
  createdAt: string;
};

export class OrderResponseDto {
  id: string;
  userId: string;
  user: UserResponseDto;
  addressId?: string;
  address?: AddressResponseDto;
  code: number;
  status: OrderStatusEnum;
  paymentMethod: PaymentMethodEnum;
  customerName: string;
  customerPhone: string;
  subtotal: string;
  deliveryFee: string;
  discount: string;
  total: string;
  items: OrderItem[];
  history: OrderHistory[];
  createdAt: Date;
  updatedAt: Date;
}
