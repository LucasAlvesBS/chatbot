import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateConsultantsTable1765420364159 implements MigrationInterface {
  private TABLE_NAMES = {
    CONSULTANTS: 'consultants',
    DOCTORS: 'doctors',
    PATIENTS: 'patients',
  };

  private COLUMN_NAMES = {
    DOCTOR_ID: 'doctor_id',
    PATIENT_ID: 'patient_id',
    REFERENCE_ID: 'reference_id',
    IDEMPOTENCY_KEY: 'idempotency_key',
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.TABLE_NAMES.CONSULTANTS,
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          }),
          new TableColumn({
            name: this.COLUMN_NAMES.REFERENCE_ID,
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'start_date',
            type: 'timestamp',
            isNullable: false,
          }),
          new TableColumn({
            name: this.COLUMN_NAMES.IDEMPOTENCY_KEY,
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: this.COLUMN_NAMES.DOCTOR_ID,
            type: 'uuid',
            isNullable: false,
          }),
          new TableColumn({
            name: this.COLUMN_NAMES.PATIENT_ID,
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

    await queryRunner.createForeignKeys(this.TABLE_NAMES.CONSULTANTS, [
      new TableForeignKey({
        name: `FK_${this.TABLE_NAMES.CONSULTANTS}_DOCTOR`.toUpperCase(),
        columnNames: [this.COLUMN_NAMES.DOCTOR_ID],
        referencedColumnNames: ['id'],
        referencedTableName: this.TABLE_NAMES.DOCTORS,
        onDelete: 'NO ACTION',
      }),
      new TableForeignKey({
        name: `FK_${this.TABLE_NAMES.CONSULTANTS}_PATIENT`.toUpperCase(),
        columnNames: [this.COLUMN_NAMES.PATIENT_ID],
        referencedColumnNames: ['id'],
        referencedTableName: this.TABLE_NAMES.PATIENTS,
        onDelete: 'NO ACTION',
      }),
    ]);

    await queryRunner.createIndices(this.TABLE_NAMES.CONSULTANTS, [
      new TableIndex({
        name: `IDX_${this.TABLE_NAMES.CONSULTANTS}_DOCTOR_PATIENT`.toUpperCase(),
        columnNames: [
          this.COLUMN_NAMES.DOCTOR_ID,
          this.COLUMN_NAMES.PATIENT_ID,
        ],
      }),
      new TableIndex({
        name: `IDX_${this.TABLE_NAMES.CONSULTANTS}_DOCTOR`.toUpperCase(),
        columnNames: [this.COLUMN_NAMES.DOCTOR_ID],
      }),
      new TableIndex({
        name: `IDX_${this.TABLE_NAMES.CONSULTANTS}_PATIENT`.toUpperCase(),
        columnNames: [this.COLUMN_NAMES.PATIENT_ID],
      }),
      new TableIndex({
        name: `IDX_${this.TABLE_NAMES.CONSULTANTS}_REFERENCE_ID`.toUpperCase(),
        columnNames: [this.COLUMN_NAMES.REFERENCE_ID],
      }),
    ]);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_CONSULTANTS_IDEMPOTENCY_KEY_ACTIVE"
        ON "consultants" ("idempotency_key")
      WHERE "deleted_at" IS NULL;
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_CONSULTANTS_DOCTOR_ID_START_DATE_ACTIVE"
        ON "consultants" ("doctor_id", "start_date")
      WHERE "deleted_at" IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAMES.CONSULTANTS, true, true, true);
  }
}
