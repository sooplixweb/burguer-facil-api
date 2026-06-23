import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductAddonRequestDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
