import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSettingsController } from 'src/controller/system-settings.contoller';
import { SystemSettingsEntity } from 'src/entities/system-settings-entity';
import { SystemSettingsService } from 'src/services/system-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([SystemSettingsEntity])],
  controllers: [SystemSettingsController],
  providers: [SystemSettingsService],
  exports: [SystemSettingsService],
})
export class SystemSettingsModule {}
