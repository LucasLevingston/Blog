import { FastifyInstance } from 'fastify';
import z from 'zod';
import {
  createPost,
  deletePost,
  getAllPostsById,
  getPost,
  updatePost,
} from '../controllers/postController';
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
        }),
        response: {
          201: z.object({
            id: z.number(),
            title: z.string(),
            content: z.string(),
            authorId: z.string().uuid(),
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
          id: z.number(),
        }),
        response: {
          200: z.object({
            id: z.number(),
            title: z.string(),
            content: z.string(),
            authorId: z.string().uuid(),
            updatedAt: z.string(),
          }),
          400: z.object({
            error: z.string(),
          }),
          404: z.object({
            error: z.string(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    updatePost
  );

  fastify.get(
    '/:id',
    {
      schema: {
        summary: 'Get post by id',
        tags: ['Posts'],
        params: z.object({
          id: z.number(),
        }),
        response: {
          200: z.object({
            id: z.number(),
            title: z.string(),
            content: z.string(),
            authorId: z.string().uuid(),
            createdAt: z.string(),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    getPost
  );

  fastify.get(
    '/',
    {
      schema: {
        summary: 'Get all posts',
        tags: ['Posts'],
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              title: z.string(),
              content: z.string(),
              authorId: z.string().uuid(),
              createdAt: z.string(),
            })
          ),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    getAllPostsById
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        summary: 'Delete post',
        tags: ['Posts'],
        params: z.object({
          id: z.number(),
        }),
        response: {
          204: z.object({}),
          404: z.object({
            error: z.string(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    deletePost
  );
}
