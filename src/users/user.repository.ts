import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./user.entity";
import { CreateUserDto, UpdateUserDto, RespondUserDto } from './dto';

@Injectable()
export class UsersRepository {
    private users: User[] = [];
    private nextId: number = 1;

    async create(createUserDto: CreateUserDto): Promise<RespondUserDto> {
        const newUser = new User({ ...createUserDto, id: this.nextId });
        this.users.push(newUser);
        this.nextId++;
        return new RespondUserDto(newUser);
    }


    async findAll(): Promise<RespondUserDto[]> {
        const users = this.users
        return users.map(user => new RespondUserDto(user));
    }

    async findById(id: number): Promise<RespondUserDto | undefined> {
        const user = this.users.find(user => user.id === id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return new RespondUserDto(user);
    }


    async update(id: number, updateUserDto: UpdateUserDto): Promise<RespondUserDto> {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        Object.assign(user, updateUserDto);
        return new RespondUserDto(user);
    }

    async delete(id: number): Promise<boolean> {
        const userIndex = this.users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        this.users.splice(userIndex, 1);
        return true;
    }
}
