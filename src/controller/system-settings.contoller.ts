import { Body, Controller, Get, Put } from '@nestjs/common';
import { SystemSettingsRequestDto } from 'src/dtos/request/system-settings-request.dto';
import { SystemSettingsResponseDto } from 'src/dtos/response/system-settings-response.dto';
import { SystemSettingsService } from 'src/services/system-settings.service';

@Controller('system-settings')
export class SystemSettingsController {
  constructor(private readonly systemSettingsService: SystemSettingsService) {}

  @Get()
  findSettings(): Promise<SystemSettingsResponseDto> {
    return this.systemSettingsService.findSettings();
  }

  @Put()
  updateSettings(
    @Body() dto: SystemSettingsRequestDto,
  ): Promise<SystemSettingsResponseDto> {
    return this.systemSettingsService.updateSettings(dto);
  }

  @Get('ordering-availability')
  isOrderingAvailable(): Promise<SystemSettingsResponseDto> {
    return this.systemSettingsService.isOrderingAvailable();
  }
}
