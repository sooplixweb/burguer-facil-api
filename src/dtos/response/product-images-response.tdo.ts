import { Expose } from 'class-transformer';

export class ProductImageResponseDto {
  @Expose()
  id: number;

  @Expose()
  fileName: string;

  @Expose()
  url: string;

  @Expose()
  isPrimary: boolean;
}
