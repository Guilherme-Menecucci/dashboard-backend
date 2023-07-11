import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/modules/shared/services/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const createUser: CreateUserDto = {
      name: createUserDto.name,
      image: createUserDto.image,
    };

    const createdUser = this.prismaService.user.create({ data: createUser });

    if (!createdUser) {
      throw new Error('Could not create the User');
    }

    return createdUser;
  }

  async findOrCreate(id: string, createUserDto: CreateUserDto) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!!foundUser) {
      return foundUser;
    }

    return this.create(createUserDto);
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne({ id = '' }: Partial<User>) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
