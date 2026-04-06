import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedUsers1775450016500 implements MigrationInterface {
    name = 'SeedUsers1775450016500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Se insertan 3 usuarios de prueba (seeds)
        await queryRunner.query(`
            INSERT INTO "user" (name, email, password, "dragonBallZIds") VALUES
            ('Goku', 'goku@dragonball.com', 'password123', '{1, 2, 3}'),
            ('Vegeta', 'vegeta@dragonball.com', 'password123', '{4, 5, 6}'),
            ('Gohan', 'gohan@dragonball.com', 'password123', '{7, 8}')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Se eliminan los 3 usuarios de prueba al revertir
        await queryRunner.query(`
            DELETE FROM "user" WHERE email IN ('goku@dragonball.com', 'vegeta@dragonball.com', 'gohan@dragonball.com')
        `);
    }
}
