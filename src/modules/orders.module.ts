import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from 'src/controller/orders.controller';
import { ImageEntity } from 'src/entities/image.entity';
import { OrderEntity } from 'src/entities/order.entity';
import { ProductEntity } from 'src/entities/product-entity';
import { ProductsModule } from './products.module';
import { ImageService } from 'src/services/image.service';
import { OrdersService } from 'src/services/orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, ProductEntity, ImageEntity]),
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ImageService],
  exports: [OrdersService],
})
export class OrdersModule {}
