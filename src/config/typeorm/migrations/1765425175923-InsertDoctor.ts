import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertDoctor1765425175923 implements MigrationInterface {
  private REGISTRATION_NUMBER = 'CRM-GO 36774';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        INSERT INTO doctors (name, registration_number)
        VALUES ('Flávia Sena', $1)
      `,
      [this.REGISTRATION_NUMBER],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM doctors WHERE registration_number = $1',
      [this.REGISTRATION_NUMBER],
    );
  }
}
