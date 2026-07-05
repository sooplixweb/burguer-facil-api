import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesController } from 'src/controller/address.controller';
import { AddressEntity } from 'src/entities/address.entity';
import { AddressService } from 'src/services/address.service';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  controllers: [AddressesController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
