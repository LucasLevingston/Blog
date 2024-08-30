import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createPostService,
  deletePostService,
  getAllPostsService,
  getPostService,
  updatePostService,
} from '../services/postService';
import { PostRequestBody } from '../types/request';

interface PostParams {
  postId: number;
}

export const getPost = async (
  request: FastifyRequest<{ Params: PostParams }>,
  reply: FastifyReply
) => {
  const { postId } = request.params;
  try {
    const post = await getPostService(Number(postId));
    if (!post) {
      reply.status(404).send({ error: 'Post not found' });
    }
    reply.status(201).send(post);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const getAllPosts = async (
  request: FastifyRequest<{
    Querystring: { order: 'asc' | 'desc' };
  }>,
  reply: FastifyReply
) => {
  const { order } = request.query;
  const user = request.user;
  try {
    const posts = await getAllPostsService(order, user ? user.userId : null);
    reply.status(200).send(posts);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const createPost = async (
  request: FastifyRequest<{
    Body: {
      title: string;
      content: string;
    };
  }>,
  reply: FastifyReply
) => {
  const { title, content } = request.body;
  const user = request.user;

  try {
    if (!user || !user.userId) {
      return reply.status(400).send({ error: 'Author Id is required' });
    }

    const post = await createPostService(title, content, user.userId);
    reply.status(201).send(post);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const updatePost = async (
  request: FastifyRequest<{
    Params: { postId: string };
    Body: PostRequestBody;
  }>,
  reply: FastifyReply
) => {
  const { postId } = request.params;
  const { title, content } = request.body;
  const user = request.user;

  try {
    if (!user || !user.userId) {
      return reply.status(401).send({ error: 'User not authenticated' });
    }

    const post = await getPostService(Number(postId));
    if (!post) {
      return reply.status(404).send({ error: 'Post not found' });
    }

    const updatedPost = await updatePostService(
      Number(postId),
      title,
      content,
      user.userId
    );
    return reply.status(200).send(updatedPost);
  } catch (error) {
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const deletePost = async (
  request: FastifyRequest<{ Params: { postId: string } }>,
  reply: FastifyReply
) => {
  const { postId } = request.params;
  const user = request.user;

  try {
    if (!user || !user.userId) {
      return reply.status(401).send({ error: 'User not authenticated' });
    }
    if (!user.userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const post = await getPostService(Number(postId));
    if (!post) {
      return reply.status(404).send({ error: 'Post not found' });
    }
    if (post.authorId != user.userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
    const result = await deletePostService(Number(postId), user.userId);
    reply.status(204).send(result);
  } catch (error) {
    reply.status(500).send({ error: error || 'Internal Server Error' });
  }
};
