import { Expose } from 'class-transformer';

export class SystemSettingsResponseDto {
  @Expose()
  id: string;

  @Expose()
  openingTime: string;

  @Expose()
  closingTime: string;

  @Expose()
  timezone: string;

  @Expose()
  ordersEnabled: boolean;

  @Expose()
  available: boolean;

  @Expose()
  reason?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
