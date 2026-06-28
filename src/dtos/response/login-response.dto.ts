import { Expose } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';
import { UserResponseDto } from './user-response.dto';

export class LoginResponseDto {
  @Expose()
  token: string;

  @Expose()
  expiresIn: number;

  @Expose()
  role: UserRole;

  @Expose()
  user: UserResponseDto
}
