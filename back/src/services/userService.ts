import { User } from '@prisma/client';
import { comparePassword, generateToken, hashPassword } from '../utils/authUtils';
import prisma from '../prismaClient';

export const createUserService = async (
  username: string,
  password: string,
  email: string
): Promise<User> => {
  try {
    const hashedPassword = await hashPassword(password);
    return await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    throw new Error('Error creating user');
  }
};

export const loginUserService = async (
  username: string,
  password: string
): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    return user;
  } catch (error) {
    throw new Error('Error during login');
  }
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
    throw new Error('Post not found');
  }

  return await prisma.user.delete({ where: { id } });
};
