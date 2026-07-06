import { Expose, Type } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';
import { AddressResponseDto } from './address-response.dto';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  role: UserRole;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  @Type(() => AddressResponseDto)
  addresses: AddressResponseDto[];

  @Expose()
  dateRegistration: Date;
}
