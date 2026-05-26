import { OrderStatusEnum } from 'src/dtos/enums/order-status.enum';
import { PaymentMethodEnum } from 'src/dtos/enums/payment-method.enum';
import { OrderItem } from 'src/types/order-Item-type';

type OrderHistory = {
  status: OrderStatusEnum;
  label: string;
  time?: string;
  createdAt: string;
};

export class OrderResponseDto {
  id: string;
  code: number;
  status: OrderStatusEnum;
  paymentMethod: PaymentMethodEnum;
  customerName: string;
  customerPhone: string;
  addressStreet: string;
  addressCityState: string;
  addressComplement?: string;
  subtotal: string;
  deliveryFee: string;
  discount: string;
  total: string;
  items: OrderItem[];
  history: OrderHistory[];
  createdAt: Date;
  updatedAt: Date;
}
