import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateConsultantsTable1765420364159 implements MigrationInterface {
  private tableNames = {
    consultants: 'consultants',
    doctors: 'doctors',
    patients: 'patients',
  };

  private columnNames = {
    doctorId: 'doctor_id',
    patientId: 'patient_id',
    referenceId: 'reference_id',
    idempotencyKey: 'idempotency_key',
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableNames.consultants,
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          }),
          new TableColumn({
            name: this.columnNames.referenceId,
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'start_date',
            type: 'timestamp',
            isNullable: false,
          }),
          new TableColumn({
            name: this.columnNames.idempotencyKey,
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: this.columnNames.doctorId,
            type: 'uuid',
            isNullable: false,
          }),
          new TableColumn({
            name: this.columnNames.patientId,
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

    await queryRunner.createForeignKeys(this.tableNames.consultants, [
      new TableForeignKey({
        name: `FK_${this.tableNames.consultants}_DOCTOR`.toUpperCase(),
        columnNames: [this.columnNames.doctorId],
        referencedColumnNames: ['id'],
        referencedTableName: this.tableNames.doctors,
        onDelete: 'NO ACTION',
      }),
      new TableForeignKey({
        name: `FK_${this.tableNames.consultants}_PATIENT`.toUpperCase(),
        columnNames: [this.columnNames.patientId],
        referencedColumnNames: ['id'],
        referencedTableName: this.tableNames.patients,
        onDelete: 'NO ACTION',
      }),
    ]);

    await queryRunner.createIndices(this.tableNames.consultants, [
      new TableIndex({
        name: `IDX_${this.tableNames.consultants}_DOCTOR_PATIENT`.toUpperCase(),
        columnNames: [this.columnNames.doctorId, this.columnNames.patientId],
      }),
      new TableIndex({
        name: `IDX_${this.tableNames.consultants}_DOCTOR`.toUpperCase(),
        columnNames: [this.columnNames.doctorId],
      }),
      new TableIndex({
        name: `IDX_${this.tableNames.consultants}_PATIENT`.toUpperCase(),
        columnNames: [this.columnNames.patientId],
      }),
      new TableIndex({
        name: `IDX_${this.tableNames.consultants}_${this.columnNames.referenceId}`.toUpperCase(),
        columnNames: [this.columnNames.referenceId],
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
    await queryRunner.dropTable(this.tableNames.consultants, true, true, true);
  }
}
