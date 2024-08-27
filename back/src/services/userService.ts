import { comparePassword, generateToken, hashPassword } from '../utils/authUtils';
import prisma from '../prismaClient';
import { FastifyError } from 'fastify';

export const createUserService = async (
  username: string,
  password: string,
  email: string
): Promise<{ id: string; username: string; email: string }> => {
  try {
    const hashedPassword = await hashPassword(password);
    const result = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    if (!result) {
      throw new Error('Error on create user');
    }
    const user = {
      id: result.id,
      username: result.username,
      email: result.email,
    };
    return user;
  } catch (error) {
    throw new Error('Error creating user');
  }
};

export const loginUserService = async (
  email: string,
  password: string
): Promise<{
  user: { email: string; id: string; username: string };
  token: string;
} | null> => {
  const user = await getByEmail(email);

  if (!user) {
    const error: FastifyError = {
      statusCode: 404,
      message: 'User not found',
      name: 'NotFoundError',
      code: 'USER_NOT_FOUND',
    };
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    const error: FastifyError = {
      statusCode: 401,
      message: 'Invalid password',
      name: 'UnauthorizedError',
      code: 'INVALID_PASSWORD',
    };
    throw error;
  }

  const token = generateToken(user.id);

  return {
    user: {
      email: user.email,
      username: user.username,
      id: user.id,
    },
    token,
  };
};

export const getByUsername = async (username: string) => {
  return prisma.user.findUnique({
    where: { username },
  });
};
export const getByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const deleteUserService = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    const error: FastifyError = {
      statusCode: 404,
      message: 'User not found',
      name: 'NotFoundError',
      code: 'NOT_FOUND',
    };
    throw error;
  }
  return await prisma.user.delete({ where: { id } });
};
