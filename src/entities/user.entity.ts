import { UserRole } from 'src/dtos/enums/user-role.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

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
}
