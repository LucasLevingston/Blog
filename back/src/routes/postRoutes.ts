import { FastifyInstance } from 'fastify';
import z from 'zod';
import {
  createPost,
  deletePost,
  getAllPostsById,
  getPost,
  updatePost,
} from '../controllers/postController';
import { PostParams } from '../types/request';
import { authenticate } from '../middleware/authMiddleware';

export async function postRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);

  fastify.post(
    '/',
    {
      schema: {
        summary: 'Create a new post',
        description: 'This endpoint allows a user to create a new post.',
        tags: ['Posts'],
        body: z.object({
          title: z.string().max(16, 'Title must be less than 16 characters'),
          content: z.string().max(1000, 'Content must be less than 1000 characters'),
          authorId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            id: z.string().uuid(),
            title: z.string(),
            content: z.string(),
            authorId: z.string().uuid(),
            createdAt: z.string(),
          }),
          400: z.object({
            error: z.string(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },

    createPost
  );

  fastify.put(
    '/:id',
    {
      schema: {
        summary: 'Update post',
        tags: ['Posts'],
        body: z.object({
          title: z.string().max(16, 'O texto deve ser menor que 16 caracteres'),
          content: z.string().max(1000),
        }),
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          201: z.object({
            title: z.string(),
            content: z.string(),
            authorId: z.string().uuid(),
          }),
        },
      },
    },
    updatePost
  );

  fastify.get<{ Params: { id: string } }>(
    '/',
    {
      schema: {
        summary: 'Get post by id',
        tags: ['Posts'],
      },
    },
    getAllPostsById
  );

  fastify.get<{ Params: PostParams }>(
    '/:id',
    {
      schema: {
        summary: 'Get post',
        tags: ['Posts'],
        params: z.object({
          eventId: z.string().uuid(),
        }),
      },
    },
    getPost
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        summary: 'Get post',
        tags: ['Posts'],
      },
    },
    deletePost
  );
}
