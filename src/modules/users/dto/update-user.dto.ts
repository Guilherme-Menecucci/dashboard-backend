import { PartialType } from '@nestjs/mapped-types';
import { UserEntity } from '../entities/users.entity';

export class UpdateUserDto extends PartialType(UserEntity) {}
