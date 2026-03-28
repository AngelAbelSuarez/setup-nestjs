
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseProvider = {
  provide: 'DATABASE_CONFIG',
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {

    const isTest = process.env.NODE_ENV === 'test';

    const baseConfig: TypeOrmModuleOptions = {
      type: 'postgres',
      host: configService.get<string>('POSTGRES_DB_HOST') || 'localhost',
      port: configService.get<number>('POSTGRES_DB_PORT') || 5432,
      username: configService.get<string>('POSTGRES_DB_USER') || 'postgres',
      password: configService.get<string>('POSTGRES_DB_PASSWORD') || 'postgres',
      database: configService.get<string>('POSTGRES_DB_DATABASE') || 'usersdb',
      autoLoadEntities: true,
      synchronize: false,
    };

    if (isTest) {
      return {
        ...baseConfig,
        type: 'postgres',
        host: configService.get<string>('POSTGRES_DB_HOST') || 'localhost',
        port: configService.get<number>('POSTGRES_DB_PORT') || 5432,
        username: configService.get<string>('POSTGRES_DB_USER') || 'postgres',
        password: configService.get<string>('POSTGRES_DB_PASSWORD') || 'postgres',
        database: configService.get<string>('POSTGRES_DB_DATABASE') || 'usersdb_test',
        autoLoadEntities: true,
        synchronize: true,
      };
    }

    return baseConfig;
  },
  inject: [ConfigService],
};