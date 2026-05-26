import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class SystemSettingsRequestDto {
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'openingTime must be in HH:mm format',
  })
  openingTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'closingTime must be in HH:mm format',
  })
  closingTime?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsBoolean()
  ordersEnabled?: boolean;
}