import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemSettingsRequestDto } from 'src/dtos/request/system-settings-request.dto';
import { SystemSettingsResponseDto } from 'src/dtos/response/system-settings-response.dto';
import { SystemSettingsEntity } from 'src/entities/system-settings-entity';
import { toResponse } from 'src/utils/transform-response';
import { Repository } from 'typeorm';

@Injectable()
export class SystemSettingsService {
  constructor(
    @InjectRepository(SystemSettingsEntity)
    private readonly systemSettingsRepository: Repository<SystemSettingsEntity>,
  ) {}

  async findSettings(): Promise<SystemSettingsResponseDto> {
    const settings = await this.findOrCreateSettings();

    return this.toResponse(settings);
  }

  async updateSettings(
    dto: SystemSettingsRequestDto,
  ): Promise<SystemSettingsResponseDto> {
    const settings = await this.findOrCreateSettings();

    Object.assign(settings, dto);

    const savedSettings = await this.systemSettingsRepository.save(settings);

    return this.toResponse(savedSettings);
  }

  async isOrderingAvailable(): Promise<SystemSettingsResponseDto> {
    const settings = await this.findOrCreateSettings();

    return this.toResponse(settings);
  }

  private async findOrCreateSettings(): Promise<SystemSettingsEntity> {
    let settings = await this.systemSettingsRepository.findOne({
      where: {},
      order: {
        createdAt: 'ASC',
      },
    });

    if (!settings) {
      settings = this.systemSettingsRepository.create({
        openingTime: '09:00',
        closingTime: '17:00',
        timezone: 'America/Sao_Paulo',
        ordersEnabled: true,
      });

      settings = await this.systemSettingsRepository.save(settings);
    }

    return settings;
  }

  private toResponse(
    settings: SystemSettingsEntity,
  ): SystemSettingsResponseDto {
    const availability = this.getAvailability(settings);

    return toResponse(SystemSettingsResponseDto, {
      id: settings.id,
      openingTime: settings.openingTime,
      closingTime: settings.closingTime,
      timezone: settings.timezone,
      ordersEnabled: settings.ordersEnabled,
      available: availability.available,
      reason: availability.reason,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    });
  }

  private getAvailability(settings: SystemSettingsEntity): {
    available: boolean;
    reason?: string;
  } {
    if (!settings.ordersEnabled) {
      return {
        available: false,
        reason: 'Pedidos desativados no momento.',
      };
    }

    const now = new Date();

    const currentTime = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: settings.timezone,
    });

    const currentMinutes = this.timeToMinutes(currentTime);
    const openingMinutes = this.timeToMinutes(settings.openingTime);
    const closingMinutes = this.timeToMinutes(settings.closingTime);

    const isOpen =
      openingMinutes === closingMinutes ||
      (openingMinutes < closingMinutes
        ? currentMinutes >= openingMinutes && currentMinutes < closingMinutes
        : currentMinutes >= openingMinutes || currentMinutes < closingMinutes);

    return {
      available: isOpen,
      reason: isOpen ? undefined : 'Fora do horário de funcionamento.',
    };
  }

  private timeToMinutes(time: string): number {
    const [hour, minute] = time.slice(0, 5).split(':').map(Number);
    return hour * 60 + minute;
  }
}
