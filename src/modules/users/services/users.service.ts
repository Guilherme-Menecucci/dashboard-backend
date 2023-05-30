import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/modules/shared/services/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PasswordService } from '../../shared/services/password.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(PrismaService) private prismaService: PrismaService,
    @Inject(PasswordService) private passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createUser: CreateUserDto = {
      name: createUserDto.name,
      email: createUserDto.email,
      image: createUserDto.image,
    };

    if (createUserDto.password)
      createUser.password = await this.passwordService.hashPassword(
        createUserDto.password,
      );

    const createdUser = this.prismaService.user.create({ data: createUser });

    if (!createdUser) {
      throw new Error('Could not create the User');
    }

    return createdUser;
  }

  async findOrCreate(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const foundUser = await this.prismaService.user.findUnique({
      where: { email: email },
    });

    if (!!foundUser) {
      return foundUser;
    }

    return this.create(createUserDto);
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne({ id = '', email = '' }: Partial<User>) {
    return this.prismaService.user.findUnique({ where: { email, id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
