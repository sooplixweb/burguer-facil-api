import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRole } from 'src/dtos/enums/user-role.enum';
import { AddressRequestDto } from 'src/dtos/request/address-request.dto';
import { AddressResponseDto } from 'src/dtos/response/address-response.dto';
import { AddressService } from 'src/services/address.service';

type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
};

type AuthenticatedRequest = ExpressRequest & {
  user: AuthenticatedUser;
};

@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(
    @Body() dto: AddressRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<AddressResponseDto> {
    return this.addressService.create(dto, req.user.id);
  }

  @Get('find-all')
  findAll(@Req() req: AuthenticatedRequest): Promise<AddressResponseDto[]> {
    return this.addressService.findAll(req.user);
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<AddressResponseDto> {
    return this.addressService.findById(id, req.user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: AddressRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<AddressResponseDto> {
    return this.addressService.update(id, dto, req.user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    return this.addressService.remove(id, req.user);
  }
}
