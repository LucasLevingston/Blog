import { FastifyInstance } from 'fastify';
import z from 'zod';
import { deleteUser, loginUser, registerUser } from '../controllers/userController';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/register',
    {
      schema: {
        summary: 'Register a new user',
        description: 'This endpoint allows a new user to register.',
        tags: ['Users'],
        body: z.object({
          username: z.string().min(3, 'Username must be at least 3 characters long'),
          email: z.string().email('Invalid email address'),
          password: z.string().min(6, 'Password must be at least 6 characters long'),
        }),
        response: {
          201: z.object({
            id: z.string().uuid(),
            username: z.string(),
            email: z.string(),
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
    registerUser
  );
  fastify.post(
    '/login',
    {
      schema: {
        summary: 'Login a user',
        description: 'This endpoint allows an existing user to login.',
        tags: ['Users'],
        body: z.object({
          email: z.string().email('Invalid email address').optional(),
          username: z.string().email('Invalid usermname').optional(),
          password: z.string().min(6, 'Password must be at least 6 characters long'),
        }),
        response: {
          200: z.object({
            token: z.string(),
            user: z.object({
              id: z.string().uuid(),
              username: z.string(),
              email: z.string(),
            }),
          }),
          400: z.object({
            error: z.string(),
          }),
          401: z.object({
            error: z.string(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    loginUser
  );
  fastify.delete(
    '/delete/:id',
    {
      schema: {
        summary: 'Delete a user',
        description: 'This endpoint allows an admin to delete a user by ID.',
        tags: ['Users'],
        params: z.object({
          id: z.string().uuid('Invalid user ID format'),
        }),
        response: {
          200: z.object({
            message: z.string(),
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
    deleteUser
  );
}
