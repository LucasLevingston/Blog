import { PrismaClient, Post } from '@prisma/client';

const prisma = new PrismaClient();

export const postModel = prisma.post;
