import { UserRole } from 'src/dtos/enums/user-role.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Generated } from 'typeorm';

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

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  dateRegistration: Date;
}
