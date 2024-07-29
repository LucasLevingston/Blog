// src/controllers/userController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { createUserService, loginUserService } from '../services/userService';

interface RegisterBody {
  username: string;
  password: string;
}

export const registerUser = async (
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) => {
  const { username, password } = request.body;

  try {
    const user = await createUserService(username, password);
    reply.status(201).send(user);
  } catch (error) {
    reply.status(500).send(error);
  }
};
export const loginUser = async (
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) => {
  const { username, password } = request.body;
  try {
    const user = await loginUserService(username, password);
    reply.status(201).send(user);
  } catch (error) {
    reply.status(500).send(error);
  }
};
