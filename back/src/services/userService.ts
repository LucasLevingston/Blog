import { PrismaClient, User } from '@prisma/client';
import { comparePassword, generateToken, hashPassword } from '../utils/authUtils';

const SECRET_KEY = process.env.TOKEN_JWT || 'default-secret-key';

const prisma = new PrismaClient();

export const createUserService = async (
  username: string,
  password: string
): Promise<User> => {
  if (await getByUsername(username)) {
    throw new Error('User already exists');
  }
  try {
    const hashedPassword = await hashPassword(password);
    return await prisma.user.create({
      data: {
        username,
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

    if (user && (await comparePassword(password, user.password))) {
      const sucess = { ...user, token: generateToken(user.id) };
      return sucess;
    }

    return null;
  } catch (error) {
    throw new Error('Error during login');
  }
};

export const getByUsername = async (username: string) => {
  return prisma.user.findUnique({
    where: { username },
  });
};
