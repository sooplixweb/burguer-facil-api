import { UserRole } from 'src/dtos/enums/user-role.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { AddressEntity } from './address.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @OneToMany(() => AddressEntity, (address) => address.user, {
    onDelete: 'CASCADE',
  })
  addresses: AddressEntity[];

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  dateRegistration: Date;
}
