import prisma from '../prismaClient';

export const createPostService = async (
  title: string,
  content: string,
  authorId: string
) => {
  try {
    return await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });
  } catch {
    throw new Error('Error on create post on database');
  }
};

export const updatePostService = async (
  id: number,
  title: string,
  content: string,
  authorId: string
) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    throw new Error('Post not found');
  }
  if (post.authorId !== authorId) {
    throw new Error('Not authorized');
  }
  return await prisma.post.update({
    where: { id },
    data: { title, content },
  });
};

export const deletePostService = async (id: number, authorId: string) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    throw new Error('Post not found');
  }
  if (post.authorId !== authorId) {
    throw new Error('Not authorized');
  }
  return await prisma.post.delete({ where: { id } });
};

export const getPostService = async (id: number) => {
  return await prisma.post.findUnique({ where: { id } });
};

export const getAllPostsByIdService = async (authorId: string) => {
  const posts = await prisma.post.findMany({
    where: { authorId },
    // orderBy: { createdAt: 'asc' },
  });
  return posts;
};
