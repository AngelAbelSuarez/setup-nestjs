import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';
import { CharacterDto } from '@/ClientsDragonBallZ/dto/character.dto'

export class RespondUserDragonBallZDto {
    @ApiProperty({ example: '4a488157-4198-4489-9c89-859d76ccb060', description: 'The unique identifier of the user' })
    id: string;

    @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
    name: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user' })
    email: string;

    @ApiProperty({ example: [
        {
            id: 1,
            name: 'Goku',
            ki: '1000',
            maxKi: '1000',
            race: 'Saiyan',
            gender: 'Male',
            description: 'The strongest being in the universe',
            image: 'https://example.com/goku.jpg',
            affiliation: 'Saiyan'
        },
        {
            id: 2,
            name: 'Vegeta',
            ki: '1000',
            maxKi: '1000',
            race: 'Saiyan',
            gender: 'Male',
            description: 'The strongest being in the universe',
            image: 'https://example.com/vegeta.jpg',
            affiliation: 'Saiyan'
        } 
    ], description: 'The dragon ball Z characters' })
    dragonBallZCharacters?: CharacterDto[];

    constructor(user: User, dragonBallZCharacters: CharacterDto[]){
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.dragonBallZCharacters = dragonBallZCharacters ?? [] ;
    }
}