import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ProductsModule } from './modules/products.module';
import { UserModule } from './modules/user.module';
import { OrdersModule } from './modules/orders.module';
import { SystemSettingsModule } from './modules/system-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),

    ProductsModule,
    OrdersModule,
    UserModule,
    SystemSettingsModule,
  ],
})
export class AppModule {}
