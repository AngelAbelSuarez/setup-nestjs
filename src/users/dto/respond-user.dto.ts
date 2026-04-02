import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class RespondUserDto {
  @ApiProperty({
    example: '4a488157-4198-4489-9c89-859d76ccb060',
    description: 'The unique identifier of the user',
  })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'The dragon ball z ids of the user',
  })
  dragonBallZIds?: number[];

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.dragonBallZIds = user.dragonBallZIds ?? [];
  }
}
