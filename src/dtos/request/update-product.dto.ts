import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ProductRequestDto } from './product-request.dto';

function parseStringArray(value: unknown) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== 'string') return value;

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return value ? [value] : [];
  }
}

export class UpdateProductRequestDto extends PartialType(ProductRequestDto) {
  @IsOptional()
  @IsArray()
  @Transform(({ value }: { value: unknown }) => parseStringArray(value))
  existingImageIds?: string[];

  @IsOptional()
  @IsString()
  primaryImageId?: string;
}
