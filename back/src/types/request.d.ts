// src/types/request.d.ts
import { FastifyRequest } from 'fastify';

export interface PostRequestBody {
  title: string;
  content: string;
}

export interface PostRequest extends FastifyRequest {
  Body: PostRequestBody;
}

export interface PostParams {
  id: number;
}
