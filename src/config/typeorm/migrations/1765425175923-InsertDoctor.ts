import { MigrationInterface, QueryRunner } from 'typeorm';

const REGISTRATION_NUMBER = 'CRM-GO 36774';

export class InsertDoctor1765425175923 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        INSERT INTO doctors (name, registration_number)
        VALUES ('Flávia Sena', $1)
      `,
      [REGISTRATION_NUMBER],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM doctors WHERE registration_number = $1',
      [REGISTRATION_NUMBER],
    );
  }
}
