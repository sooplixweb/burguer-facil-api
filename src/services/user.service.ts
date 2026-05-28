import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UserRequestDto } from 'src/dtos/request/user-request.dto';
import { UserResponseDto } from 'src/dtos/response/user-response.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from 'src/dtos/request/login-request.dto';
import { LoginResponseDto } from 'src/dtos/response/login-response.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async create(dto: UserRequestDto): Promise<UserResponseDto> {
    const userExists = await this.repo.findOne({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new Error('Email já cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const userSave = this.repo.create({
      name: dto.name,
      email: dto.email,
      password: passwordHash,
      role: dto.role,
    });

    const savedUser = await this.repo.save(userSave);

    return plainToInstance(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<UserResponseDto> {
    const users = this.repo.find();
    return plainToInstance(UserResponseDto, users);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.repo.findOne({
      where: { id },
    });
    return plainToInstance(UserResponseDto, user);
  }
  async update(id: string, dto: UserRequestDto): Promise<UserResponseDto> {
    const user = await this.repo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (dto.name) {
      user.name = dto.name;
    }

    if (dto.email) {
      user.email = dto.email;
    }

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    const updatedUser = await this.repo.save(user);

    return plainToInstance(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<string> {
    const user = await this.repo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.repo.remove(user);

    return `Usuario ${user.name}`;
  }

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.repo.findOne({ where: { email: dto.email } });

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload = { sub: user.id, email: user.email };

    const token = this.jwtService.sign(payload);

    return {
      token,
      expiresIn: 60,
      role: user.role, // só informativo para o front
    };
  }
}
