import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto, UpdateUserDto, RespondUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) { }

  async create(createUserDto: CreateUserDto): Promise<RespondUserDto> {
    try {

      const email = await this.usersRepository.findByEmail(createUserDto.email);

      if (email) {
        throw new ConflictException('Email already exists');
      }

      return await this.usersRepository.create(createUserDto);
    } catch (error) {
      throw error;
    }

  }

  async findAll(): Promise<RespondUserDto[]> {
    return await this.usersRepository.findAll();
  }

  async findById(id: string): Promise<RespondUserDto | undefined> {
    const user = await this.usersRepository.findById(id);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<RespondUserDto> {
    const user = await this.usersRepository.update(id, updateUserDto);
    return user
  }

  async delete(id: string): Promise<boolean> {
    return await this.usersRepository.delete(id);
  }
}
