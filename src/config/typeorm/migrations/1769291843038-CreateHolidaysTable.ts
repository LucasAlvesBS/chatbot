import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableCheck,
  TableColumn,
  TableIndex,
} from 'typeorm';

const TABLE_NAME = 'holidays';

export class CreateHolidaysTable1769291843038 implements MigrationInterface {
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
            name: 'date',
            type: 'date',
            isNullable: false,
          }),
          new TableColumn({
            name: 'name',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'type',
            type: 'int',
            isNullable: false,
          }),
          new TableColumn({
            name: 'is_recurring',
            type: 'boolean',
            isNullable: false,
          }),
          new TableColumn({
            name: 'country_code',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'state_code',
            type: 'varchar',
            isNullable: true,
          }),
          new TableColumn({
            name: 'city_code',
            type: 'varchar',
            isNullable: true,
          }),
          new TableColumn({
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          }),
        ],
      }),
    );

    await queryRunner.createCheckConstraint(
      TABLE_NAME,
      new TableCheck({
        columnNames: ['type'],
        expression: 'type >= 0 AND type < 3',
        name: `CK_${TABLE_NAME}_valid_type`.toUpperCase(),
      }),
    );

    await queryRunner.createIndices(TABLE_NAME, [
      new TableIndex({
        name: `IDX_${TABLE_NAME}_type`.toUpperCase(),
        columnNames: ['type'],
      }),
      new TableIndex({
        name: `IDX_${TABLE_NAME}_is_recurring`.toUpperCase(),
        columnNames: ['is_recurring'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME, true, true, true);
  }
}
