import { Expose } from 'class-transformer';

export class ProductAddonResponseDto {
  @Expose()
  id?: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  price: number;

  @Expose()
  isActive?: boolean;
}
