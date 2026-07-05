import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class AddressRequestDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  state: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}-?\d{3}$/)
  zipCode: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
