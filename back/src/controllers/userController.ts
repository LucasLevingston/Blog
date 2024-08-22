// src/controllers/userController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createUserService,
  deleteUserService,
  getByEmail,
  getByUsername,
  loginUserService,
} from '../services/userService';
import { comparePassword, generateToken } from '../utils/authUtils';

export const registerUser = async (
  request: FastifyRequest<{
    Body: { username: string; password: string; email: string };
  }>,
  reply: FastifyReply
) => {
  const { username, password, email } = request.body;

  try {
    if (await getByUsername(username)) {
      throw new Error('User already exists');
    }
    const user = await createUserService(username, password, email);
    reply.status(201).send(user);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const loginUser = async (
  request: FastifyRequest<{
    Body: { password: string; username?: string; email?: string };
  }>,
  reply: FastifyReply
) => {
  const { username, email, password } = request.body;

  try {
    let user;

    if (email) {
      user = await getByEmail(email);
      if (!user) {
        throw new Error('User not exists');
      }
    } else if (username) {
      user = await getByUsername(username);
      if (!user) {
        throw new Error('User not exists');
      }
    } else {
      return reply.status(400).send({ error: 'Username or email is required.' });
    }

    if (user && (await comparePassword(password, user.password))) {
      const success = { ...user, token: generateToken(user.id) };
      return reply.status(200).send(success);
    } else {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const deleteUser = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const idUser = request.params.id;
  if (!idUser) {
    throw new Error('Id');
  }
  try {
    await deleteUserService(idUser);
    reply.status(204).send();
  } catch (error) {
    reply.status(501).send(error);
  }
};
