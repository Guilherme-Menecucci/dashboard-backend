import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateGrupos1600083988609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'grupos',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'id_cliente',
            type: 'integer',
          },
          {
            name: 'id_group',
            type: 'text',
          },
          {
            name: 'display_name',
            type: 'text',
          },
          {
            name: 'pseudo',
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
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('grupos');
  }
}
