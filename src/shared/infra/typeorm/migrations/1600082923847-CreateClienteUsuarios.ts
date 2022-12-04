import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateClienteUsuarios1600082923847
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cliente_usuarios',
        columns: [
          {
            name: 'id_cliente',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'id_usuario',
            type: 'integer',
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'cliente_usuarios',
      new TableForeignKey({
        name: 'cliente_usuarios_userId',
        columnNames: ['id_usuario'],
        referencedColumnNames: ['id'],
        referencedTableName: 'usuarios',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'cliente_usuarios',
      'cliente_usuarios_userId',
    );

    await queryRunner.dropTable('cliente_usuarios', true, true, true);
  }
}
