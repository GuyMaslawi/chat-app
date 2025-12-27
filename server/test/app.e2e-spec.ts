import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new (await import('@nestjs/common')).ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  describe('Auth', () => {
    it('/auth/register (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user).toHaveProperty('username', 'testuser');
      authToken = response.body.access_token;
      userId = response.body.user.id;
    });

    it('/auth/login (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
    });
  });

  describe('Rooms', () => {
    let roomId: string;

    it('/rooms (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/rooms')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Room' })
        .expect(201);

      expect(response.body).toHaveProperty('name', 'Test Room');
      roomId = response.body._id;
    });

    it('/rooms (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/rooms')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('/rooms/:id (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/rooms/${roomId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', roomId);
    });
  });

  describe('Messages', () => {
    let roomId: string;

    beforeAll(async () => {
      const roomResponse = await request(app.getHttpServer())
        .post('/rooms')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Message Test Room' });
      roomId = roomResponse.body._id;
    });

    it('/rooms/:roomId/messages (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post(`/rooms/${roomId}/messages`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Hello, world!' })
        .expect(201);

      expect(response.body).toHaveProperty('content', 'Hello, world!');
    });

    it('/rooms/:roomId/messages (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/rooms/${roomId}/messages`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});

