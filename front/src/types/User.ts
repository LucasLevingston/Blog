// src/types.ts

import { Post } from './Post.ts';

export interface LoggedUser {
  user: User;
  token: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  posts: Post[];
}
