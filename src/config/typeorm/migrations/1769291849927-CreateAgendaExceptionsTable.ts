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
  private tableNames = {
    agendaExceptions: 'agenda_exceptions',
    doctors: 'doctors',
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableNames.agendaExceptions,
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
      this.tableNames.agendaExceptions,
      new TableForeignKey({
        name: `FK_${this.tableNames.agendaExceptions}_DOCTOR`.toUpperCase(),
        columnNames: ['doctor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: this.tableNames.doctors,
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndices(this.tableNames.agendaExceptions, [
      new TableIndex({
        name: `IDX_${this.tableNames.agendaExceptions}_START_DATE_END_DATE`.toUpperCase(),
        columnNames: ['start_date', 'end_date'],
      }),
      new TableIndex({
        name: `IDX_${this.tableNames.agendaExceptions}_START_DATE`.toUpperCase(),
        columnNames: ['start_date'],
      }),
      new TableIndex({
        name: `IDX_${this.tableNames.agendaExceptions}_END_DATE`.toUpperCase(),
        columnNames: ['end_date'],
      }),
      new TableIndex({
        name: `IDX_${this.tableNames.agendaExceptions}_DOCTOR`.toUpperCase(),
        columnNames: ['doctor_id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(
      this.tableNames.agendaExceptions,
      true,
      true,
      true,
    );
  }
}
