import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createPostService,
  deletePostService,
  getAllPostsByIdService,
  getPostService,
  updatePostService,
} from '../services/postService';
import { PostRequestBody } from '../types/request';

interface PostParams {
  id: number;
}

export const getPost = async (
  request: FastifyRequest<{ Params: PostParams }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  try {
    const post = await getPostService(Number(id));
    reply.status(201).send(post);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const getAllPostsById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  if (!id) {
    throw new Error('ID is required');
  }
  try {
    const post = await getAllPostsByIdService(id);
    reply.status(201).send(post);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const createPost = async (
  request: FastifyRequest<{ Body: PostRequestBody }>,
  reply: FastifyReply
) => {
  const { title, content } = request.body;
  const authorId = request.user?.id;

  if (!authorId) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
  try {
    const post = await createPostService(title, content, authorId);
    reply.status(201).send(post);
  } catch (error) {
    reply.status(500).send(error);
  }
};

export const updatePost = async (
  request: FastifyRequest<{ Params: PostParams; Body: PostRequestBody }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const { title, content } = request.body;
  const authorId = request.user?.id;

  if (!authorId) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  try {
    const post = await updatePostService(id, title, content, authorId);
    reply.status(200).send(post);
  } catch (error) {
    reply.status(500).send({ error: error || 'Internal Server Error' });
  }
};

export const deletePost = async (
  request: FastifyRequest<{ Params: PostParams }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const authorId = request.user?.id;

  if (!authorId) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  try {
    await deletePostService(id, authorId);
    reply.status(204).send(); // No content
  } catch (error) {
    reply.status(500).send({ error: error || 'Internal Server Error' });
  }
};
