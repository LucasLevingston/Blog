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
  const post = await getPostService(id);

  if (post?.authorId !== authorId) {
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
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('Database error occurred');
  }
};

export const getAllPostsService = async (
  order: 'asc' | 'desc',
  userId: string | null
) => {
  // const whereClause = userId ? { authorId: userId } : {};
  const posts = await prisma.post.findMany({
    // where: whereClause,
    orderBy: { createdAt: order },
  });
  return posts;
};
