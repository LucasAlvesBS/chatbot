import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableCheck,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class CreateHolidaysTable1769291843038 implements MigrationInterface {
  private tableName = 'holidays';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
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

    await queryRunner.createCheckConstraint(
      this.tableName,
      new TableCheck({
        columnNames: ['type'],
        expression: 'type >= 0 AND type < 3',
        name: `CK_${this.tableName}_valid_type`.toUpperCase(),
      }),
    );

    await queryRunner.createIndices(this.tableName, [
      new TableIndex({
        name: `IDX_${this.tableName}_type`.toUpperCase(),
        columnNames: ['type'],
      }),
      new TableIndex({
        name: `IDX_${this.tableName}_is_recurring`.toUpperCase(),
        columnNames: ['is_recurring'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName, true, true, true);
  }
}
