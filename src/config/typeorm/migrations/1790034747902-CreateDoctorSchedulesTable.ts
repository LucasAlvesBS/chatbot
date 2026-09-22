import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateDoctorSchedulesTable1790034747902
  implements MigrationInterface
{
  private TABLE_NAME = 'doctor_schedules';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.TABLE_NAME,
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          }),
          new TableColumn({
            name: 'day_of_week',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'start_time',
            type: 'time',
            isNullable: false,
          }),
          new TableColumn({
            name: 'end_time',
            type: 'time',
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
      this.TABLE_NAME,
      new TableForeignKey({
        name: `FK_${this.TABLE_NAME}_DOCTOR`.toUpperCase(),
        columnNames: ['doctor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'doctors',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      this.TABLE_NAME,
      new TableIndex({
        name: `IDX_${this.TABLE_NAME}_DOCTOR`.toUpperCase(),
        columnNames: ['doctor_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAME, true, true, true);
  }
}
