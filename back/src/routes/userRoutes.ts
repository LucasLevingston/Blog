import { FastifyInstance } from 'fastify';
import { loginUser, registerUser } from '../controllers/userController';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/register',
    {
      schema: {
        summary: 'Register users',
        tags: ['Users'],
      },
    },
    registerUser
  );
  fastify.post(
    '/login',
    {
      schema: {
        summary: 'Login users',
        tags: ['Users'],
      },
    },
    loginUser
  );
}
