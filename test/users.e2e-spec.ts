import { TestAppContext, initTestApp, resetTestApp, closeTestApp } from './helpers/test-app.helper';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import request from 'supertest';
import { userData } from './mocks/users.mock';
import { RespondUserDto } from '@/users/dto';

describe('UsersController (e2e)', () => {

    let testContext: TestAppContext;
    let app: INestApplication;
    let usersRepository: Repository<User>;

    beforeAll(async () => {
        // Initialize test app with the helper
        testContext = await initTestApp();

        // Extract what we need from the context
        app = testContext.app;
        usersRepository = testContext.usersRepository;

    });

    afterAll(async () => {
        // Restore axios mock
        // axiosGetSpy.mockRestore();

        // Clean up test app resources
        await closeTestApp(testContext);
    });

    beforeEach(async () => {
        // Reset test state between tests
        await resetTestApp(testContext);

        // Reset axios mock calls
        // axiosGetSpy.mockClear();
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

        })

        it('It should respond with a conflict error if the email already exists', async () => {

            // Create first user
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

        })

    })
});