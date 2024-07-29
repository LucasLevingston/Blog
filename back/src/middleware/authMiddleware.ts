import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.TOKEN_JWT || 'default-secret-key';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  const protectedRoutes = ['/posts', '/posts/', '/posts/:id', '/posts/create'];

  if (protectedRoutes.includes(request.routerPath) && request.method !== 'GET') {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw new Error('Authorization header is missing');
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
      (request as any).user = decoded;
    } catch (error) {
      reply.code(401).send({ success: false, message: 'Unauthorized' });
    }
  }
};
