import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/shared/services/prisma.service';
import { CreateSessionDto } from '../dto/create-session.dto';
import { UpdateSessionDto } from '../dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  async create(createSessionDto: CreateSessionDto) {
    const createdSession = await this.prismaService.session.create({
      data: createSessionDto as CreateSessionDto,
    });

    if (!createdSession) {
      throw new Error('Could not create a Session');
    }

    return createdSession;
  }

  async findOrCreate(createSessionDto: Partial<CreateSessionDto>) {
    const { userId, id } = createSessionDto;

    const foundSession = await this.prismaService.session.findMany({
      where: userId
        ? {
            userId,
            sessionToken: {
              not: undefined,
            },
            expires: {
              gte: new Date(),
            },
          }
        : { id },
    });

    if (foundSession.length != 0) {
      return foundSession[0];
    }

    return this.create(createSessionDto as CreateSessionDto);
  }

  async findAll() {
    return this.prismaService.session.findMany();
  }

  async findOne({ id = '', sessionToken = '' }: Partial<CreateSessionDto>) {
    let where: Prisma.SessionWhereUniqueInput = { id };

    if (sessionToken) {
      where = { sessionToken };
    }

    return this.prismaService.session.findUnique({ where });
  }

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
