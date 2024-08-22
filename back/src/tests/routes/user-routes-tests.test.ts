import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { userRoutes } from '../../routes/userRoutes'; // Ajuste o caminho conforme necessário
import jwt from 'jsonwebtoken';

// Função para criar o servidor Fastify
const buildServer = () => {
  const fastify = Fastify();
  fastify.register(userRoutes);
  return fastify;
};

// Função para criar um token de autenticação
const createAuthToken = (userId: string) => {
  const secret = `${process.env.JWT_SECRET_KEY}`; // Substitua pelo seu segredo
  return jwt.sign({ id: userId }, secret, { expiresIn: '1h' });
};

describe('User Routes', () => {
  let server: FastifyInstance;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    server = buildServer();
    await server.ready();

    // Criar um usuário para autenticação
    const userResponse = await server.inject({
      method: 'POST',
      url: '/register',
      payload: {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
      },
    });

    userId = JSON.parse(userResponse.payload).id;
    authToken = createAuthToken(userId);
  });

  afterAll(async () => {
    await server.close();
  });

  it('should register a user', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/register',
      payload: {
        username: 'newuser',
        password: 'password456',
        email: 'new@example.com',
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toHaveProperty('username', 'newuser');
  });

  it('should login a user', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'testuser',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('token');
    expect(response.json().user).toHaveProperty('id');
    expect(response.json().user).toHaveProperty('username', 'testuser');
  });

  it('should delete a user', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/delete/${userId}`,
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('message', 'User deleted successfully');
  });
});
