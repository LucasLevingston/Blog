import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const userModel = prisma.user;
