import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import User from './User';

@Entity('cliente_usuarios')
@Exclude()
class ClientUsers {
  // @Exclude()
  // id: string;

  @PrimaryColumn()
  @Expose({ name: 'cliente' })
  id_cliente: number;

  @PrimaryColumn()
  id_usuario: number;

  @ManyToOne(() => User, u => u.clientList)
  @JoinColumn({
    name: 'id_usuario',
    referencedColumnName: 'id',
  })
  userList?: User;
}

export default ClientUsers;
