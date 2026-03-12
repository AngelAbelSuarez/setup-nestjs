import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseProvider = {
  provide: 'DATABASE_CONFIG',
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST') || 'localhost',
    port: configService.get<number>('DB_PORT') || 5432,
    username: configService.get<string>('DB_USER') || 'root',
    password: configService.get<string>('DB_PASSWORD') || '123456a',
    database: configService.get<string>('DB_DATABASE') || 'postgres',
    autoLoadEntities: true,
    synchronize: true,
  }),
  inject: [ConfigService],
};