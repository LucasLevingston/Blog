import { FastifyInstance } from 'fastify';

import {
  createPost,
  deletePost,
  getAllPostsById,
  getPost,
  updatePost,
} from '../controllers/postController';
import { PostParams } from '../types/request';
import { authenticate } from '../middleware/authMiddleware';

export async function postRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);

  fastify.get<{ Params: PostParams }>('/:id', getPost);
  fastify.get<{ Params: { id: string } }>('/', getAllPostsById);
  fastify.post('/create', createPost);
  fastify.put('/:id', updatePost);
  fastify.delete('/:id', deletePost);
}
