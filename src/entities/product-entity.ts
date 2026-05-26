import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ImageEntity } from './image.entity';
import { ProductCategoryEnum } from 'src/dtos/enums/product-category.enum';
import { ProductStatusEnum } from 'src/dtos/enums/product-status.enum';
import { IsEnum, IsOptional } from 'class-validator';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ length: 180 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Index()
  @Column({ type: 'enum', enum: ProductCategoryEnum })
  category: ProductCategoryEnum;

  @IsOptional()
  @Column({ type: 'enum', enum: ProductStatusEnum, nullable: true })
  isActive?: ProductStatusEnum;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  promoPrice?: string;

  @Column({nullable:false})
  stockEnabled: boolean;

  @Column({ nullable: true, default: 0 })
  stock?: number;

  @OneToMany(() => ImageEntity, (image) => image.product, {
    cascade: true,
  })
  images: ImageEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
