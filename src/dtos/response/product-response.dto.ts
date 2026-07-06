import { Expose, Type } from 'class-transformer';
import { ProductCategoryEnum } from '../enums/product-category.enum';
import { ProductAddonResponseDto } from './product-addon-response.dto';
import { ProductImageResponseDto } from './product-images-response.tdo';
import { ProductStatusEnum } from '../enums/product-status.enum';

export class ProductResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  category: ProductCategoryEnum;

  @Expose()
  isActive: ProductStatusEnum;

  @Expose()
  price: string;

  @Expose()
  promoPrice?: string;

  @Expose()
  stockEnabled: boolean;

  @Expose()
  stock?: number;

  @Expose()
  @Type(() => ProductImageResponseDto)
  images: ProductImageResponseDto[];

  @Expose()
  @Type(() => ProductAddonResponseDto)
  addons?: ProductAddonResponseDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
