import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  Min,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { ProductCategoryEnum } from '../enums/product-category.enum';
import { ProductAddonRequestDto } from './product-addons-request.dto';
import { ProductStatusEnum } from '../enums/product-status.enum';

export class ProductRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Campo nome fazio' })
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Campo descrição vazio' })
  description?: string;

  @IsEnum(ProductCategoryEnum)
  @IsNotEmpty({ message: 'Campo categoria vazio' })
  category: ProductCategoryEnum;

  @IsOptional()
  @IsEnum(ProductStatusEnum)
  isActive?: ProductStatusEnum;

  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: 'Campo price vazio' })
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  promoPrice?: number;

  @Transform(
    ({ value }: { value: unknown }) => value === true || value === 'true',
  )
  @IsBoolean()
  stockEnabled: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @IsOptional()
  @IsArray()
  @Transform(({ value }: { value: unknown }) => {
    if (Array.isArray(value)) {
      return plainToInstance(ProductAddonRequestDto, value as object[]);
    }

    if (typeof value !== 'string') return value;

    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed)
        ? plainToInstance(ProductAddonRequestDto, parsed as object[])
        : [];
    } catch {
      return [];
    }
  })
  @ValidateNested({ each: true })
  @Type(() => ProductAddonRequestDto)
  addons?: ProductAddonRequestDto[];
}
