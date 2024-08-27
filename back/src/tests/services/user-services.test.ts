import { describe, it, expect, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import {
  createUserService,
  loginUserService,
  getByUsername,
  getByEmail,
  deleteUserService,
} from '../../services/userService';
import { hashPassword } from '../../utils/authUtils';
import prisma from '../../prismaClient';

vi.mock('@prisma/client', () => {
  const PrismaClient = {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  };
  return { PrismaClient: () => PrismaClient };
});

vi.mock('../utils/authUtils', () => ({
  hashPassword: vi.fn(),
}));

describe('User Service', () => {
  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  };

  it('should create a user', async () => {
    const hashedPassword = 'hashedpassword';
    (hashPassword as vi.Mock).mockResolvedValue(hashedPassword);
    (prisma.user.create as vi.Mock).mockResolvedValue({
      ...mockUser,
      password: hashedPassword,
    });

    const user = await createUserService(mockUser);
    expect(user).toEqual({ ...mockUser, password: hashedPassword });
  });

  it('should login a user', async () => {
    (prisma.user.findUnique as vi.Mock).mockResolvedValue(mockUser);

    const user = await loginUserService('testuser');
    expect(user).toEqual(mockUser);
  });

  it('should get a user by username', async () => {
    (prisma.user.findUnique as vi.Mock).mockResolvedValue(mockUser);

    const user = await getByUsername('testuser');
    expect(user).toEqual(mockUser);
  });

  it('should get a user by email', async () => {
    (prisma.user.findUnique as vi.Mock).mockResolvedValue(mockUser);

    const user = await getByEmail('test@example.com');
    expect(user).toEqual(mockUser);
  });

  it('should delete a user', async () => {
    (prisma.user.findUnique as vi.Mock).mockResolvedValue(mockUser);
    (prisma.user.delete as vi.Mock).mockResolvedValue(mockUser);

    const user = await deleteUserService('1');
    expect(user).toEqual(mockUser);
  });
});
