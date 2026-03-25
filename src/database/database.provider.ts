
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseProvider = {
  provide: 'DATABASE_CONFIG',
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    // Determinar si estamos en entorno de pruebas
    const isTest = process.env.NODE_ENV === 'test';

    // Configuración base
    const baseConfig: TypeOrmModuleOptions = {
      type: 'postgres',
      host: configService.get<string>('POSTGRES_DB_HOST') || 'localhost',
      port: configService.get<number>('POSTGRES_DB_PORT') || 5432,
      username: configService.get<string>('POSTGRES_DB_USER') || 'angel',
      password: configService.get<string>('POSTGRES_DB_PASSWORD') || '123456a',
      database: configService.get<string>('POSTGRES_DB_DATABASE') || 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    };

    if (isTest) {
      return {
        ...baseConfig,
        type: 'postgres',
        host: configService.get<string>('POSTGRES_DB_HOST') || 'localhost',
        port: configService.get<number>('POSTGRES_DB_PORT') || 5432,
        username: configService.get<string>('POSTGRES_DB_USER') || 'angel',
        password: configService.get<string>('POSTGRES_DB_PASSWORD') || '123456a',
        database: configService.get<string>('POSTGRES_DB_DATABASE') || 'postgres_test',
        autoLoadEntities: true,
        synchronize: true,
      };
    }

    return baseConfig;
  },
  inject: [ConfigService],
};