import { User } from '@prisma/client';

export class UserEntity implements Omit<User, 'id'> {
  name: string;
  image: string | null;
}
