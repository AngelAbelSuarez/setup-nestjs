import { Module } from '@nestjs/common';
import { ClientsProviders } from './clients.provider';

@Module({
  providers: [...ClientsProviders],
  exports: [...ClientsProviders],
})
export class ClientsModule {}