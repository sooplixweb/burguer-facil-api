import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UserRequestDto } from 'src/dtos/request/user-request.dto';
import { UpdateUserRequestDto } from 'src/dtos/request/update-user-request.dto';
import { UserResponseDto } from 'src/dtos/response/user-response.dto';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from 'src/dtos/request/login-request.dto';
import { LoginResponseDto } from 'src/dtos/response/login-response.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/dtos/enums/user-role.enum';
import { toResponse } from 'src/utils/transform-response';
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
      throw new ConflictException('Esse e-mail já está cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const userSave = this.repo.create({
      name: dto.name,
      email: dto.email,
      password: passwordHash,
      role: dto.role,
      phone: dto.phone,
    });

    const savedUser = await this.repo.save(userSave);

    return toResponse(UserResponseDto, savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.repo.find({
      order: { dateRegistration: 'DESC' },
      relations: { addresses: true },
    });

    return toResponse(UserResponseDto, users);
  }

  async findCustomers(): Promise<UserResponseDto[]> {
    const users = await this.repo.find({
      where: { role: UserRole.CUSTOMER },
      order: { dateRegistration: 'DESC' },
    });

    return toResponse(UserResponseDto, users);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.repo.findOne({
      where: { id },
      relations: { addresses: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return toResponse(UserResponseDto, user);
  }

  async update(
    id: string,
    dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
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

    if (dto.phone) {
      user.phone = dto.phone;
    }

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    const updatedUser = await this.repo.save(user);

    return toResponse(UserResponseDto, updatedUser);
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

    const payload = { sub: user.id, email: user.email, role: user.role };

    const token = this.jwtService.sign(payload);

    return toResponse(LoginResponseDto, {
      token,
      expiresIn: 60,
      role: user.role,
      user,
    });
  }
}
