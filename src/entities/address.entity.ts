import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { OrderEntity } from './order.entity';

@Entity('addresses')
export class AddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column({ length: 2 })
  state: string;

  @Column()
  zipCode: string;

  @Column({ nullable: true })
  complement?: string;

  @Column({ nullable: true })
  reference?: string;

  @Column({ default: false })
  isDefault: boolean;

  @OneToMany(() => OrderEntity, (order) => order.address)
  orders: OrderEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}