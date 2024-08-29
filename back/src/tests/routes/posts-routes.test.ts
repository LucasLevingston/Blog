import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import request from 'supertest';
import { postRoutes } from '../../routes/postRoutes';
import { authenticate } from '../../middleware/authMiddleware';
import {
  createPostService,
  updatePostService,
  getPostService,
  getAllPostsByIdService,
  deletePostService,
} from '../../services/postService';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { userRoutes } from '../../routes/userRoutes';
import { generateToken } from '../../utils/authUtils';

// vi.mock('../middleware/authMiddleware', () => ({
//   authenticate: (request: FastifyRequest, reply: FastifyReply) => {
//     if (request.headers.authorization === 'Bearer valid-token') {
//       return;
//     } else {
//       reply.code(401).send({ error: 'Unauthorized' });
//     }
//   },
// }));

vi.mock('../services/postService');
const TOKEN = generateToken('9be581d2-6f79-4d12-9c35-06294c5c390e');

let app: FastifyInstance;
let id: number;
describe('Post Routes', () => {
  beforeEach(async () => {
    app = fastify();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    await app.register(postRoutes, { prefix: '/posts' });
    await app.register(userRoutes);

    await app.ready();
  });

  afterEach(async () => {
    vi.resetAllMocks();
    await app.close();
  });
  const mockUser = {
    id: '9be581d2-6f79-4d12-9c35-06294c5c390e',
    username: 'testPostRoutes',
    password: 'password123',
    email: 'testPostRoutes@example.com',
  };
  describe('POST /posts', async () => {
    it('should create a new post', async () => {
      const newPost = {
        title: 'Test Titlee',
        content: 'Test contentt',
      };

      const newUser = {
        username: mockUser.username,
        email: mockUser.email,
        password: mockUser.password,
      };

      await request(app.server).post('/register').send(newUser);

      await request(app.server)
        .post('/posts')
        .set({ Authorization: `Bearer ${TOKEN}` })
        .send(newPost)
        .expect(201);
      // {
      //     id: expect.any(Number),
      //     title: newPost.title,
      //     content: newPost.content,
      //     authorId: mockUser.id,
      //   }
    });

    //   it('should return 400 for invalid data', async () => {
    //     const invalidPost = {
    //       title: 'A very long title exceeding the limit',
    //       content: 'Test content',
    //     };

    //     const response = await supertest(app.server)
    //       .post('/posts')
    //       .set('Authorization', 'Bearer valid-token')
    //       .send(invalidPost);

    //     expect(response.status).toBe(400);
    //     expect(response.body).toEqual({ error: expect.any(String) });
    //   });

    //   it('should return 500 on service error', async () => {
    //     const newPost = {
    //       title: 'Test Title',
    //       content: 'Test content',
    //       authorId: '123e4567-e89b-12d3-a456-426614174000',
    //     };

    //     (createPostService as Mock).mockRejectedValue(new Error('Service error'));

    //     const response = await supertest(app.server)
    //       .post('/posts')
    //       .set('Authorization', 'Bearer valid-token')
    //       .send(newPost);

    //     expect(response.status).toBe(500);
    //     expect(response.body).toEqual({ error: 'Service error' });
    //   });

    //   it('should return 401 if unauthorized', async () => {
    //     const response = await supertest(app.server).post('/posts').send({});

    //     expect(response.status).toBe(401);
    //     expect(response.body).toEqual({ error: 'Unauthorized' });
    //   });
    // });

    // describe('PUT /posts/:id', () => {
    //   it('should update an existing post', async () => {
    //     const updatedPost = {
    //       title: 'Updated Title',
    //       content: 'Updated content',
    //     };

    //     (updatePostService as Mock).mockResolvedValue({
    //       id: 1,
    //       ...updatedPost,
    //       authorId: '123e4567-e89b-12d3-a456-426614174000',
    //       updatedAt: new Date().toISOString(),
    //     });

    //     const response = await supertest(app.server)
    //       .put('/posts/1')
    //       .set('Authorization', 'Bearer valid-token')
    //       .send(updatedPost);

    //     expect(response.status).toBe(200);
    //     expect(response.body).toEqual({
    //       id: 1,
    //       title: updatedPost.title,
    //       content: updatedPost.content,
    //       authorId: '123e4567-e89b-12d3-a456-426614174000',
    //       updatedAt: expect.any(String),
    //     });
    //   });

    //   it('should return 404 if post not found', async () => {
    //     (updatePostService as Mock).mockRejectedValue(new Error('Post not found'));

    //     const response = await supertest(app.server)
    //       .put('/posts/1')
    //       .set('Authorization', 'Bearer valid-token')
    //       .send({ title: 'Updated Title', content: 'Updated content' });

    //     expect(response.status).toBe(404);
    //     expect(response.body).toEqual({ error: 'Post not found' });
    //   });

    //   it('should return 401 if unauthorized', async () => {
    //     const response = await supertest(app.server)
    //       .put('/posts/1')
    //       .send({ title: 'Updated Title', content: 'Updated content' });

    //     expect(response.status).toBe(401);
    //     expect(response.body).toEqual({ error: 'Unauthorized' });
    //   });
    // });

    // describe('GET /posts/:id', () => {
    //   it('should return a post by ID', async () => {
    //     (getPostService as Mock).mockResolvedValue({
    //       id: 1,
    //       title: 'Test Title',
    //       content: 'Test content',
    //       authorId: '123e4567-e89b-12d3-a456-426614174000',
    //       createdAt: new Date().toISOString(),
    //     });

    //     const response = await supertest(app.server)
    //       .get('/posts/1')
    //       .set('Authorization', 'Bearer valid-token');

    //     expect(response.status).toBe(200);
    //     expect(response.body).toEqual({
    //       id: 1,
    //       title: 'Test Title',
    //       content: 'Test content',
    //       authorId: '123e4567-e89b-12d3-a456-426614174000',
    //       createdAt: expect.any(String),
    //     });
    //   });

    //   it('should return 404 if post not found', async () => {
    //     (getPostService as Mock).mockRejectedValue(new Error('Post not found'));

    //     const response = await supertest(app.server)
    //       .get('/posts/1')
    //       .set('Authorization', 'Bearer valid-token');

    //     expect(response.status).toBe(404);
    //     expect(response.body).toEqual({ error: 'Post not found' });
    //   });

    //   it('should return 401 if unauthorized', async () => {
    //     const response = await supertest(app.server).get('/posts/1');

    //     expect(response.status).toBe(401);
    //     expect(response.body).toEqual({ error: 'Unauthorized' });
    //   });
    // });

    // describe('GET /posts', () => {
    //   it('should return all posts', async () => {
    //     (getAllPostsByIdService as Mock).mockResolvedValue([
    //       {
    //         id: 1,
    //         title: 'Test Title',
    //         content: 'Test content',
    //         authorId: '123e4567-e89b-12d3-a456-426614174000',
    //         createdAt: new Date().toISOString(),
    //       },
    //     ]);

    //     const response = await supertest(app.server)
    //       .get('/posts')
    //       .set('Authorization', 'Bearer valid-token');

    //     expect(response.status).toBe(200);
    //     expect(response.body).toEqual(
    //       expect.arrayContaining([
    //         {
    //           id: 1,
    //           title: 'Test Title',
    //           content: 'Test content',
    //           authorId: '123e4567-e89b-12d3-a456-426614174000',
    //           createdAt: expect.any(String),
    //         },
    //       ])
    //     );
    //   });

    //   it('should return 401 if unauthorized', async () => {
    //     const response = await supertest(app.server).get('/posts');

    //     expect(response.status).toBe(401);
    //     expect(response.body).toEqual({ error: 'Unauthorized' });
    //   });
    // });

    // describe('DELETE /posts/:id', () => {
    //   it('should delete an existing post', async () => {
    //     (deletePostService as Mock).mockResolvedValue(undefined);

    //     const response = await supertest(app.server)
    //       .delete('/posts/1')
    //       .set('Authorization', 'Bearer valid-token');

    //     expect(response.status).toBe(204);
    //     expect(response.body).toEqual({});
    //   });

    //   it('should return 404 if post not found', async () => {
    //     (deletePostService as Mock).mockRejectedValue(new Error('Post not found'));

    //     const response = await supertest(app.server)
    //       .delete('/posts/1')
    //       .set('Authorization', 'Bearer valid-token');

    //     expect(response.status).toBe(404);
    //     expect(response.body).toEqual({ error: 'Post not found' });
    //   });

    //   it('should return 401 if unauthorized', async () => {
    //     const response = await supertest(app.server).delete(`/posts/${id}`);

    //     expect(response.status).toBe(401);
    //     expect(response.body).toEqual({ error: 'Unauthorized' });
    //   });
  });
});
