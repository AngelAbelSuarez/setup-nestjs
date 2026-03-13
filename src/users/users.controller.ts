import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConflictResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, RespondUserDto } from './dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: RespondUserDto })
  @ApiConflictResponse({
    description: 'Email already exists',
    schema: {
      example: {
        message: 'Email already exists',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        message: 'Internal server error',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<RespondUserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.', type: [RespondUserDto] })
  async findAll(): Promise<RespondUserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiResponse({ status: 200, description: 'Return the user.', type: RespondUserDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findById(@Param('id') id: string): Promise<RespondUserDto | undefined> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.', type: RespondUserDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<RespondUserDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.usersService.delete(id);
  }
}
