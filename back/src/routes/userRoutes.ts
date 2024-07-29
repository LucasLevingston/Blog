import { FastifyInstance } from 'fastify';
import { loginUser, registerUser } from '../controllers/userController';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/register', registerUser);
  fastify.post('/login', loginUser);
}
