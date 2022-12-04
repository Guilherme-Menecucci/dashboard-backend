import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

@Entity('grupos')
class Group {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  id_cliente: number;

  /**
   * Group id generated in Trueconf Server
   */
  @Column()
  id_group: string;

  @Column()
  display_name: string;

  /**
   * Used to know if was created for one week day of a conference
   */
  @Column('boolean')
  pseudo: number;

  @ManyToMany(() => User, {
    eager: true,
  })
  @JoinTable({
    name: 'usuarios_grupos',
    inverseJoinColumns: [{ name: 'id_usuario', referencedColumnName: 'id' }],
    joinColumns: [{ name: 'id_grupo', referencedColumnName: 'id' }],
  })
  userList: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Group;
