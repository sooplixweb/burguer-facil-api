export class SystemSettingsResponseDto {
  id: string;
  openingTime: string;
  closingTime: string;
  timezone: string;
  ordersEnabled: boolean;
  available: boolean;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}
