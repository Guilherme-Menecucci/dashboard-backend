import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateConferencia1600084312271
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'conferencia',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'id_grupo',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'id_cliente',
            type: 'integer',
          },
          {
            name: 'titulo',
            type: 'text',
          },
          {
            name: 'token',
            type: 'text',
          },
          {
            name: 'id_conference',
            type: 'text',
          },
          {
            name: 'sala_espera',
            type: 'tinyint(1)',
          },
          {
            name: 'pode_apagar',
            type: 'tinyint(1)',
          },
          {
            name: 'status',
            type: 'tinyint(1)',
          },
          {
            name: 'controlar_encoder',
            type: 'tinyint(1)',
          },
          {
            name: 'sharing',
            type: 'tinyint(1)',
          },
          {
            name: 'salvarPadrao',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'salvarNext',
            type: 'text',
            isNullable: true,
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

    await queryRunner.createForeignKey(
      'conferencia',
      new TableForeignKey({
        name: 'conferencia_groupId',
        columnNames: ['id_grupo'],
        referencedColumnNames: ['id'],
        referencedTableName: 'grupos',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('conferencia', 'conferencia_groupId');

    await queryRunner.dropTable('conferencia');
  }
}
