import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateDoctorsTable1765420342204 implements MigrationInterface {
  private tableName = 'doctors';

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
            name: 'name',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'registration_number',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          }),
          new TableColumn({
            name: 'user_id',
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
      this.tableName,
      new TableForeignKey({
        name: `FK_${this.tableName}_USER`.toUpperCase(),
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'NO ACTION',
      }),
    );

    await queryRunner.createIndices(this.tableName, [
      new TableIndex({
        name: `IDX_${this.tableName}_REGISTRATION_NUMBER`.toUpperCase(),
        columnNames: ['registration_number'],
      }),
      new TableIndex({
        name: `IDX_${this.tableName}_USER`.toUpperCase(),
        columnNames: ['user_id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName, true, true, true);
  }
}
