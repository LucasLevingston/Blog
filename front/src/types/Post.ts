import { User } from './User.ts';

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: Date;
}
