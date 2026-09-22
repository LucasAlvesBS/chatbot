import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateAgendaExceptionsTable1769291849927
  implements MigrationInterface
{
  private TABLE_NAMES = {
    AGENDA_EXCEPTIONS: 'agenda_exceptions',
    DOCTORS: 'doctors',
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.TABLE_NAMES.AGENDA_EXCEPTIONS,
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

    await queryRunner.createForeignKey(
      this.TABLE_NAMES.AGENDA_EXCEPTIONS,
      new TableForeignKey({
        name: `FK_${this.TABLE_NAMES.AGENDA_EXCEPTIONS}_DOCTOR`.toUpperCase(),
        columnNames: ['doctor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: this.TABLE_NAMES.DOCTORS,
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndices(this.TABLE_NAMES.AGENDA_EXCEPTIONS, [
      new TableIndex({
        name: `IDX_${this.TABLE_NAMES.AGENDA_EXCEPTIONS}_START_DATE_END_DATE`.toUpperCase(),
        columnNames: ['start_date', 'end_date'],
      }),
      new TableIndex({
        name: `IDX_${this.TABLE_NAMES.AGENDA_EXCEPTIONS}_START_DATE`.toUpperCase(),
        columnNames: ['start_date'],
      }),
      new TableIndex({
        name: `IDX_${this.TABLE_NAMES.AGENDA_EXCEPTIONS}_END_DATE`.toUpperCase(),
        columnNames: ['end_date'],
      }),
      new TableIndex({
        name: `IDX_${this.TABLE_NAMES.AGENDA_EXCEPTIONS}_DOCTOR`.toUpperCase(),
        columnNames: ['doctor_id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(
      this.TABLE_NAMES.AGENDA_EXCEPTIONS,
      true,
      true,
      true,
    );
  }
}
