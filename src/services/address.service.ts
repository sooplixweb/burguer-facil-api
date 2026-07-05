import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { AddressRequestDto } from 'src/dtos/request/address-request.dto';
import { AddressResponseDto } from 'src/dtos/response/address-response.dto';
import { UserRole } from 'src/dtos/enums/user-role.enum';
import { AddressEntity } from 'src/entities/address.entity';
import { Not, Repository } from 'typeorm';

type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
};

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly repo: Repository<AddressEntity>,
  ) {}

  async create(
    dto: AddressRequestDto,
    userId: string,
  ): Promise<AddressResponseDto> {
    const addressCount = await this.repo.count({ where: { userId } });
    const isDefault = dto.isDefault ?? addressCount === 0;

    if (isDefault) {
      await this.unsetDefaultAddresses(userId);
    }

    const address = this.repo.create({
      ...dto,
      userId,
      isDefault,
    });

    const savedAddress = await this.repo.save(address);

    return this.toResponse(savedAddress);
  }

  async findAll(user: AuthenticatedUser): Promise<AddressResponseDto[]> {
    const where = user.role === UserRole.ADMIN ? {} : { userId: user.id };

    const addresses = await this.repo.find({
      where,
      order: {
        isDefault: 'DESC',
        createdAt: 'DESC',
      },
    });

    return plainToInstance(AddressResponseDto, addresses, {
      excludeExtraneousValues: true,
    });
  }

  async findById(
    id: string,
    user: AuthenticatedUser,
  ): Promise<AddressResponseDto> {
    const address = await this.findAddressById(id, user);

    return this.toResponse(address);
  }

  async update(
    id: string,
    dto: AddressRequestDto,
    user: AuthenticatedUser,
  ): Promise<AddressResponseDto> {
    const address = await this.findAddressById(id, user);

    if (dto.isDefault) {
      await this.unsetDefaultAddresses(address.userId, address.id);
    }

    Object.assign(address, dto);

    const updatedAddress = await this.repo.save(address);

    return this.toResponse(updatedAddress);
  }

  async remove(
    id: string,
    user: AuthenticatedUser,
  ): Promise<{ message: string }> {
    const address = await this.findAddressById(id, user);

    await this.repo.remove(address);

    return { message: 'Endereço removido com sucesso' };
  }

  private async findAddressById(
    id: string,
    user: AuthenticatedUser,
  ): Promise<AddressEntity> {
    const where =
      user.role === UserRole.ADMIN ? { id } : { id, userId: user.id };

    const address = await this.repo.findOne({
      where,
    });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    return address;
  }

  private async unsetDefaultAddresses(
    userId: string,
    ignoredAddressId?: string,
  ): Promise<void> {
    const where = ignoredAddressId
      ? { userId, id: Not(ignoredAddressId), isDefault: true }
      : { userId, isDefault: true };

    await this.repo.update(where, { isDefault: false });
  }

  private toResponse(address: AddressEntity): AddressResponseDto {
    return plainToInstance(AddressResponseDto, address, {
      excludeExtraneousValues: true,
    });
  }
}
