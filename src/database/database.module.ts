import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProvider } from './database.provider';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseProvider.useFactory,
      inject: [ConfigService],
    }),
  ],
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
