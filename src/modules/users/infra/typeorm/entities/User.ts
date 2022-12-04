import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Transform, Type } from 'class-transformer';

import Group from '@modules/groups/infra/typeorm/entities/Group';
import ClientUsers from './ClientUsers';

@Entity('usuarios')
class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToMany(() => ClientUsers, cu => cu.userList)
  clientList?: ClientUsers[];

  @ManyToMany(() => Group)
  @JoinTable({
    name: 'usuarios_grupos',
    inverseJoinColumns: [{ name: 'id_grupo', referencedColumnName: 'id' }],
    joinColumns: [{ name: 'id_usuario', referencedColumnName: 'id' }],
  })
  groupList?: Group[];

  @Column()
  display_name: string;

  @Column()
  login_name: string;

  @Column()
  pseudo_login: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column('tinyint')
  status: number;

  @Column()
  observacao: string;

  @Column()
  mobile_phone: string;

  @Column()
  work_phone: string;

  @Column()
  home_phone: string;

  @Column('boolean')
  is_active: number;

  // @Column('boolean')
  // is_avulso: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
