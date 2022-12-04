import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUsuarios1599856123638 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'usuarios',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'tipo',
            type: 'tinyint(1)',
          },
          {
            name: 'display_name',
            type: 'text',
          },
          {
            name: 'pseudo_login',
            type: 'text',
          },
          {
            name: 'login_name',
            type: 'text',
          },
          {
            name: 'password',
            type: 'text',
          },
          {
            name: 'email',
            type: 'text',
          },
          {
            name: 'observacao',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'mobile_phone',
            type: 'text',
            default: '000',
            isNullable: true,
          },
          {
            name: 'work_phone',
            type: 'text',
            default: '000',
            isNullable: true,
          },
          {
            name: 'home_phone',
            type: 'text',
            default: '000',
            isNullable: true,
          },
          {
            name: 'timezone',
            type: 'text',
          },
          {
            name: 'is_active',
            type: 'tinyint(1)',
            default: 1,
          },
          {
            name: 'status',
            type: 'tinyint(1)',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            onUpdate: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usuarios', true, true, true);
  }
}
