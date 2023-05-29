import { Inject, Injectable } from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/shared/services/prisma.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  async create(createAccountDto: CreateAccountDto) {
    const createdaAccount = this.prismaService.account.create({
      data: createAccountDto,
    });

    if (!createdaAccount) {
      throw new Error('Could not create a new Account');
    }

    return createdaAccount;
  }

  async findOrCreate(createAccountDto: CreateAccountDto) {
    const { userId, provider, providerAccountId } = createAccountDto;

    const foundAccount = await this.prismaService.account.findUnique({
      where: userId
        ? { userId_provider: { userId, provider } }
        : providerAccountId
        ? { provider_providerAccountId: { provider, providerAccountId } }
        : {},
    });

    if (!!foundAccount) {
      return foundAccount;
    }

    return this.create(createAccountDto);
  }

  async findAll() {
    return this.prismaService.account.findMany();
  }

  async findOne({
    id = '',
    userId = '',
    provider = '',
    providerAccountId = '',
  }: Partial<Account>) {
    let where: Prisma.AccountWhereUniqueInput = { id };

    if (userId && provider) {
      where = { userId_provider: { userId, provider } };
    }

    if (provider && providerAccountId) {
      where = { provider_providerAccountId: { provider, providerAccountId } };
    }

    return this.prismaService.account.findUnique({ where });
  }

  async update(id: number, updateaAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
