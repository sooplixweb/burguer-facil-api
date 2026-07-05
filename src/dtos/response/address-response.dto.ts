import { Expose } from 'class-transformer';

export class AddressResponseDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  street: string;

  @Expose()
  number: string;

  @Expose()
  neighborhood: string;

  @Expose()
  city: string;

  @Expose()
  state: string;

  @Expose()
  zipCode: string;

  @Expose()
  complement?: string;

  @Expose()
  reference?: string;

  @Expose()
  isDefault: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
