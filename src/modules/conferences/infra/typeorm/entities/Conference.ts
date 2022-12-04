import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('conferencia')
class Conference {
  @PrimaryGeneratedColumn('increment')
  id: number;

  /**
   * Group id that can access the conference
   * values -1 is for scheduled conferences
   */
  @Column()
  id_grupo: number;

  @Column()
  id_cliente: number;

  @Column()
  titulo: string;

  @Column()
  token: string;

  /**
   * Conference id generated in Trueconf Server
   */
  @Column()
  id_conference: string;

  /**
   * Used for know if new users enter directly in conference or waiting room
   *
   * @deprecated
   */
  @Column('boolean')
  sala_espera: number;

  /**
   * Used in important conferences that any user can delete
   */
  @Column('boolean')
  pode_apagar: number;

  @Column('tinyint')
  status: number;

  @Column('boolean')
  controlar_encoder: number;

  @Column('boolean')
  sharing: number;

  /**
   * Default name for video files created in Trueconf
   *
   * @deprecated
   */
  @Column()
  salvarPadrao: string;

  /**
   * Next name for video files created in Trueconf
   *
   * @deprecated
   */
  @Column()
  salvarNext: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Conference;
