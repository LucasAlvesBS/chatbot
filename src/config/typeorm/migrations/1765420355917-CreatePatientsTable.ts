import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableIndex,
} from 'typeorm';

const TABLE_NAME = 'patients';

export class CreatePatientsTable1765420355917 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAME,
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          }),
          new TableColumn({
            name: 'name',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'document_number',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          }),
          new TableColumn({
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          }),
          new TableColumn({
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          }),
          new TableColumn({
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          }),
        ],
      }),
    );

    await queryRunner.createIndex(
      TABLE_NAME,
      new TableIndex({
        name: `IDX_${TABLE_NAME}_DOCUMENT_NUMBER`.toUpperCase(),
        columnNames: ['document_number'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME, true, true, true);
  }
}
