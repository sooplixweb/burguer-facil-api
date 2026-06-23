import { Expose } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';

export class LoginResponseDto {
  @Expose()
  token: string;

  @Expose()
  expiresIn: number;

  @Expose()
  role: UserRole;
}
