import {
  TestAppContext,
  initTestApp,
  resetTestApp,
  closeTestApp,
} from './helpers/test-app.helper';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import request from 'supertest';
import {
  getDragonBallZIdFromUrl,
  idUserNotFound,
  mockDragonBallZData,
  userData,
  userData2,
} from './mocks/users.mock';
import { RespondUserDto, RespondUserDragonBallZDto } from '@/users/dto';
import axios from 'axios';

describe('UsersController (e2e)', () => {
  let testContext: TestAppContext;
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let axiosGetService: jest.SpyInstance;

  beforeAll(async () => {
    // Inicializar la aplicación de prueba
    testContext = await initTestApp();

    // Extract what we need from the context
    app = testContext.app;

    usersRepository = testContext.usersRepository;

    axiosGetService = jest
      .spyOn(axios, 'get')
      .mockImplementation((url: string) => {
        if (url.includes('dragonball-api.com')) {
          const id = getDragonBallZIdFromUrl(url);
          if (id !== null) {
            const data = mockDragonBallZData.find(
              (dragonBall) => dragonBall.id === id,
            );
            return Promise.resolve({ data: data });
          }
        }
        return Promise.reject(new Error(`No mock configured for URL: ${url}`));
      });
  });

  afterAll(async () => {
    axiosGetService.mockRestore();
    // Limpiar después de todos los tests
    await closeTestApp(testContext);
  });

  beforeEach(async () => {
    //Restaurar spy después de cada test
    await resetTestApp(testContext);
    axiosGetService.mockClear();
  });

  describe('POST /users', () => {
    it('It should respond with the created user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      const body = response.body as RespondUserDto;
      expect(body.id).toBeDefined();
      expect(body.name).toBe('newuser');
      expect(body.dragonBallZIds).toEqual([1, 2, 3]);

      const savedUser = await usersRepository.findOneBy({
        id: body.id,
      });
      expect(savedUser).not.toBeNull();
      expect(savedUser?.name).toBe('newuser');
    });

    it('It should respond with a bad request error if the request body is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({})
        .expect(400);

      const body = response.body as any;
      expect(body.message).toContain('name must be a string');
      expect(body.message).toContain('name should not be empty');
      expect(body.message).toContain('email must be an email');
      expect(body.message).toContain('email must be a string');
      expect(body.message).toContain('email should not be empty');
      expect(body.message).toContain('password must be a string');
      expect(body.message).toContain('password should not be empty');
      expect(body.error).toBe('Bad Request');
      expect(body.statusCode).toBe(400);
    });

    it('It should respond with a conflict error if the email already exists', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(409);

      const body = response.body as any;
      expect(body.message).toBe('Email already exists');
      expect(body.error).toBe('Conflict');
      expect(body.statusCode).toBe(409);
    });
  });

  describe('GET /users', () => {
    it('It should respond 200 code when listing users successfully', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      const body = response.body as RespondUserDto[];
      expect(body).toBeDefined();
      expect(body).toBeInstanceOf(Array);
      expect(body.length).toBe(1);
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('name');
      expect(body[0]).toHaveProperty('email');
      expect(body[0]).toHaveProperty('dragonBallZIds');
      expect(body[0].name).toBe('newuser');
      expect(body[0].email).toBe('new@example.com');
      expect(body[0].dragonBallZIds).toEqual([1, 2, 3]);
    });
  });

  describe('GET /users/:id', () => {
    it('It should respond 200 code when getting a user successfully', async () => {
      const createdUser = await request(app.getHttpServer())
        .post('/users')
        .send(userData2)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/users/${createdUser.body.id}`)
        .expect(200);

      const body = response.body as RespondUserDragonBallZDto;
      expect(body).toBeDefined();
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('email');
      expect(body).toHaveProperty('dragonBallZCharacters');
      expect(body.name).toBe('newuser2');
      expect(body.email).toBe('new2@example.com');
      expect(body.dragonBallZCharacters![0]).toHaveProperty('id');
      expect(body.dragonBallZCharacters![0].id).toBe(2);
      expect(body.dragonBallZCharacters![0]).toHaveProperty('name');
      expect(body.dragonBallZCharacters![0].name).toBe('Vegeta');
      expect(body.dragonBallZCharacters![0]).toHaveProperty('ki');
      expect(body.dragonBallZCharacters![0].ki).toBe('1000');
      expect(body.dragonBallZCharacters![0]).toHaveProperty('maxKi');
      expect(body.dragonBallZCharacters![0].maxKi).toBe('1000');
      expect(body.dragonBallZCharacters![0]).toHaveProperty('race');
      expect(body.dragonBallZCharacters![0].race).toBe('Saiyan');
      expect(body.dragonBallZCharacters![0]).toHaveProperty('gender');
      expect(body.dragonBallZCharacters![0].gender).toBe('Male');
      expect(body.dragonBallZCharacters![0]).toHaveProperty('description');
      expect(body.dragonBallZCharacters![0].description).toBe(
        'The strongest being in the universe',
      );
      expect(body.dragonBallZCharacters![0]).toHaveProperty('image');
      expect(body.dragonBallZCharacters![0].image).toBe(
        'https://example.com/vegeta.jpg',
      );
      expect(body.dragonBallZCharacters![0]).toHaveProperty('affiliation');
      expect(body.dragonBallZCharacters![0].affiliation).toBe('Saiyan');
    });
  });

  describe('PATCH /users/:id', () => {
    it('It should respond 200 code when updating a user successfully', async () => {
      const createdUser = await request(app.getHttpServer())
        .post('/users')
        .send(userData2)
        .expect(201);

      const response = await request(app.getHttpServer())
        .patch(`/users/${createdUser.body.id}`)
        .send(userData2)
        .expect(200);

      const body = response.body as RespondUserDto;
      expect(body).toBeDefined();
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('email');
      expect(body).toHaveProperty('dragonBallZIds');
      expect(body.id).toBe(createdUser.body.id);
      expect(body.name).toBe('newuser2');
      expect(body.email).toBe('new2@example.com');
      expect(body.dragonBallZIds).toEqual([2]);
    });

    it('It should respond 404 code when updating a user that does not exist', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${idUserNotFound}`)
        .send(userData2)
        .expect(404);

      const body = response.body as any;
      expect(body.message).toBe(`User with id ${idUserNotFound} not found`);
      expect(body.error).toBe('Not Found');
      expect(body.statusCode).toBe(404);
    });

    it('It should respond 409 code when updating a user with an email that already exists', async () => {
      const createdUser = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      const createdUser2 = await request(app.getHttpServer())
        .post('/users')
        .send(userData2)
        .expect(201);

      const response = await request(app.getHttpServer())
        .patch(`/users/${createdUser.body.id}`)
        .send({ ...userData, email: userData2.email })
        .expect(409);

      const body = response.body as any;
      expect(body.message).toBe('Email already exists');
      expect(body.error).toBe('Conflict');
      expect(body.statusCode).toBe(409);
    });
  });

  describe('DELETE /users/:id', () => {
    xit('It should respond 200 code when deleting a user successfully', async () => {
      const createdUser = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      const response = await request(app.getHttpServer())
        .delete(`/users/${createdUser.body.id}`)
        .expect(200);
      console.log(createdUser.body.id);
      console.log(response.body);
      const body = response.body as any;
      expect(body).toBeDefined();
      expect(body).toBe(true);
    });

    it('It should respond 404 code when deleting a user that does not exist', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${idUserNotFound}`)
        .expect(404);

      const body = response.body as any;
      expect(body.message).toBe(`User with id ${idUserNotFound} not found`);
      expect(body.error).toBe('Not Found');
      expect(body.statusCode).toBe(404);
    });
  });
});
