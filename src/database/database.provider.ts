// import { ConfigService } from '@nestjs/config';
// import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// export const databaseProvider = {
//   provide: 'DATABASE_CONFIG',
//   useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
//     type: 'postgres',
//     host: configService.get<string>('DB_HOST') || 'localhost',
//     port: configService.get<number>('DB_PORT') || 5437,
//     username: configService.get<string>('DB_USER') || 'angel',
//     password: configService.get<string>('DB_PASSWORD') || '123456a',
//     database: configService.get<string>('DB_DATABASE') || 'postgres',
//     autoLoadEntities: true,
//     synchronize: true,
//   }),
//   inject: [ConfigService],
// };


// database/database.provider.ts
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
      host: configService.get<string>('DB_HOST') || 'localhost',
      port: configService.get<number>('DB_PORT') || 5437,
      username: configService.get<string>('DB_USER') || 'angel',
      password: configService.get<string>('DB_PASSWORD') || '123456a',
      database: configService.get<string>('DB_DATABASE') || 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    };
    
    if (isTest) {
      return {
        ...baseConfig,
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5437,
        username: configService.get<string>('DB_USER') || 'angel',
        password: configService.get<string>('DB_PASSWORD') || '123456a',
        database: configService.get<string>('DB_DATABASE') || 'postgres_test',
        autoLoadEntities: true,
        synchronize: true,
      };
    }

    return baseConfig;
  },
  inject: [ConfigService],
};