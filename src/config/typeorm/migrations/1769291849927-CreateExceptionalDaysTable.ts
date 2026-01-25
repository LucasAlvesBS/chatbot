import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

const TABLE_NAMES = {
  EXCEPTIONAL_DAYS: 'exceptional_days',
  DOCTORS: 'doctors',
};

export class CreateExceptionalDaysTable1769291849927
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAMES.EXCEPTIONAL_DAYS,
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          }),
          new TableColumn({
            name: 'start_date',
            type: 'timestamp',
            isNullable: false,
          }),
          new TableColumn({
            name: 'end_date',
            type: 'timestamp',
            isNullable: false,
          }),
          new TableColumn({
            name: 'doctor_id',
            type: 'uuid',
            isNullable: false,
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

    await queryRunner.createForeignKey(
      TABLE_NAMES.EXCEPTIONAL_DAYS,
      new TableForeignKey({
        name: `FK_${TABLE_NAMES.EXCEPTIONAL_DAYS}_DOCTOR`.toUpperCase(),
        columnNames: ['doctor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLE_NAMES.DOCTORS,
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndices(TABLE_NAMES.EXCEPTIONAL_DAYS, [
      new TableIndex({
        name: `IDX_${TABLE_NAMES.EXCEPTIONAL_DAYS}_START_DATE_END_DATE`.toUpperCase(),
        columnNames: ['start_date', 'end_date'],
      }),
      new TableIndex({
        name: `IDX_${TABLE_NAMES.EXCEPTIONAL_DAYS}_START_DATE`.toUpperCase(),
        columnNames: ['start_date'],
      }),
      new TableIndex({
        name: `IDX_${TABLE_NAMES.EXCEPTIONAL_DAYS}_END_DATE`.toUpperCase(),
        columnNames: ['end_date'],
      }),
      new TableIndex({
        name: `IDX_${TABLE_NAMES.EXCEPTIONAL_DAYS}_DOCTOR`.toUpperCase(),
        columnNames: ['doctor_id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAMES.EXCEPTIONAL_DAYS, true, true, true);
  }
}
