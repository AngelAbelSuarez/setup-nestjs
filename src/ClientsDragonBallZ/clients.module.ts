import { Module } from '@nestjs/common';
import { ClientsDragonBallZ } from './clients.service';

@Module({
  providers: [ClientsDragonBallZ],
  exports: [ClientsDragonBallZ],
})
export class ClientsDragonBallZModule {}
