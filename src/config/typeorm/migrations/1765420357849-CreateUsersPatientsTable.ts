import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateUsersPatientsTable1765420357849
  implements MigrationInterface
{
  private TABLE_NAME = 'users_patients';

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
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          }),
          new TableColumn({
            name: 'patient_id',
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

    await queryRunner.createForeignKeys(this.TABLE_NAME, [
      new TableForeignKey({
        name: `FK_${this.TABLE_NAME}_USER`.toUpperCase(),
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'NO ACTION',
      }),
      new TableForeignKey({
        name: `FK_${this.TABLE_NAME}_PATIENT`.toUpperCase(),
        columnNames: ['patient_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'patients',
        onDelete: 'NO ACTION',
      }),
    ]);

    await queryRunner.createIndices(this.TABLE_NAME, [
      new TableIndex({
        name: `IDX_${this.TABLE_NAME}_USER_PATIENT`.toUpperCase(),
        columnNames: ['user_id', 'patient_id'],
      }),
      new TableIndex({
        name: `IDX_${this.TABLE_NAME}_USER`.toUpperCase(),
        columnNames: ['user_id'],
      }),
      new TableIndex({
        name: `IDX_${this.TABLE_NAME}_PATIENT`.toUpperCase(),
        columnNames: ['patient_id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAME, true, true, true);
  }
}
