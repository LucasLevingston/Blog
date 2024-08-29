import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/authUtils';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  const protectedRoutes = ['/posts', '/posts/', '/posts/:id', '/posts/create'];

  if (protectedRoutes.includes(request.url) && request.method !== 'GET') {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply
        .code(401)
        .send({ success: false, message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return reply.code(401).send({ success: false, message: 'Token is missing' });
    }

    try {
      const decoded = verifyToken(token) as { userId: string };
      request.user = decoded; // Salva o usuário decodificado na requisição
    } catch (error) {
      console.error('Token verification failed:', error);
      return reply.code(401).send({ success: false, message: 'Unauthorized' });
    }
  }
};
