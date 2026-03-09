import { ApiProperty } from '@nestjs/swagger';

export class User {
    @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
    id: number;

    @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
    name: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user' })
    email: string;

    @ApiProperty({ example: 'strongpassword123', description: 'The password of the user' })
    password: string;

    constructor(partial: Partial<User>){
        Object.assign(this, partial);
    }
}
