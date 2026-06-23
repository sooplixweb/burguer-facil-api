import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { UserService } from 'src/services/user.service';
import { UserRequestDto } from 'src/dtos/request/user-request.dto';
import { UserResponseDto } from 'src/dtos/response/user-response.dto';
import { LoginRequestDto } from 'src/dtos/request/login-request.dto';
import { LoginResponseDto } from 'src/dtos/response/login-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

type AuthenticatedUser = {
  id: string;
  email: string;
};

type AuthenticatedRequest = ExpressRequest & {
  user: AuthenticatedUser;
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(@Body() dto: UserRequestDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }

  @Post('/login')
  login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.usersService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: AuthenticatedRequest): AuthenticatedUser {
    return req.user;
  }

  @Get()
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UserRequestDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, dto);
  }
}
