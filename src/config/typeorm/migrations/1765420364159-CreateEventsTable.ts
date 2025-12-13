import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

const TABLE_NAMES = {
  EVENTS: 'events',
  DOCTORS: 'doctors',
  PATIENTS: 'patients',
};

const COLUMN_NAMES = {
  DOCTOR_ID: 'doctor_id',
  PATIENT_ID: 'patient_id',
  REFERENCE_ID: 'reference_id',
};

export class CreateEventsTable1765420364159 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAMES.EVENTS,
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          }),
          new TableColumn({
            name: COLUMN_NAMES.REFERENCE_ID,
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'start_date',
            type: 'timestamp',
            isNullable: false,
          }),
          new TableColumn({
            name: COLUMN_NAMES.DOCTOR_ID,
            type: 'uuid',
            isNullable: false,
          }),
          new TableColumn({
            name: COLUMN_NAMES.PATIENT_ID,
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

    await queryRunner.createForeignKeys(TABLE_NAMES.EVENTS, [
      new TableForeignKey({
        name: `FK_${TABLE_NAMES.EVENTS}_DOCTOR`.toUpperCase(),
        columnNames: [COLUMN_NAMES.DOCTOR_ID],
        referencedColumnNames: ['id'],
        referencedTableName: TABLE_NAMES.DOCTORS,
        onDelete: 'NO ACTION',
      }),
      new TableForeignKey({
        name: `FK_${TABLE_NAMES.EVENTS}_PATIENT`.toUpperCase(),
        columnNames: [COLUMN_NAMES.PATIENT_ID],
        referencedColumnNames: ['id'],
        referencedTableName: TABLE_NAMES.PATIENTS,
        onDelete: 'NO ACTION',
      }),
    ]);

    await queryRunner.createIndices(TABLE_NAMES.EVENTS, [
      new TableIndex({
        name: `IDX_${TABLE_NAMES.EVENTS}_DOCTOR_PATIENT`.toUpperCase(),
        columnNames: [COLUMN_NAMES.DOCTOR_ID, COLUMN_NAMES.PATIENT_ID],
      }),
      new TableIndex({
        name: `IDX_${TABLE_NAMES.EVENTS}_DOCTOR`.toUpperCase(),
        columnNames: [COLUMN_NAMES.DOCTOR_ID],
      }),
      new TableIndex({
        name: `IDX_${TABLE_NAMES.EVENTS}_PATIENT`.toUpperCase(),
        columnNames: [COLUMN_NAMES.PATIENT_ID],
      }),
      new TableIndex({
        name: `IDX_${TABLE_NAMES.EVENTS}_REFERENCE_ID`.toUpperCase(),
        columnNames: [COLUMN_NAMES.REFERENCE_ID],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAMES.EVENTS, true, true, true);
  }
}
