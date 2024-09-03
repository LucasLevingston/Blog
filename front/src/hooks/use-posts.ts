import axios from 'axios';
import { create } from 'zustand';
import { Post } from '../types/Post.ts';
import { useUser } from './use-user.ts';

const baseUrl = `${import.meta.env.VITE_BASE_URL}/posts`;

type PostProps = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: (order?: 'asc' | 'desc') => Promise<void>;
  createPost: (postData: { title: string; content: string }) => Promise<void>;
  updatePost: (
    postId: number,
    postData: { title: string; content: string }
  ) => Promise<void>;
  deletePost: (postId: number) => Promise<void>;
};

export const usePosts = create<PostProps>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async (order = 'desc') => {
    const user = useUser.getState().user; // Obtém o usuário diretamente

    if (!user) {
      set({ error: 'User is not authenticated' }); // Adiciona um erro se o usuário não estiver autenticado
      return; // Se não houver usuário, retorna
    }

    set({ loading: true, error: null });
    try {
      const response = await axios.get(baseUrl, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Usa o token do usuário
        },
        params: { order },
      });
      console.log(response);
      set({ posts: response.data });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching posts';
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  createPost: async (postData) => {
    const user = useUser.getState().user; // Verifica o usuário para autorização

    if (!user) {
      set({ error: 'User is not authenticated' }); // Adiciona um erro se o usuário não estiver autenticado
      return;
    }

    try {
      const response = await axios.post(baseUrl, postData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      set((state) => ({ posts: [...state.posts, response.data] }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating post';
      set({ error: errorMessage });
    }
  },

  updatePost: async (postId, postData) => {
    const user = useUser.getState().user; // Verifica o usuário para autorização

    if (!user) {
      set({ error: 'User is not authenticated' });
      return;
    }

    try {
      const response = await axios.put(`${baseUrl}/${postId}`, postData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === response.data.id ? response.data : post
        ),
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating post';
      set({ error: errorMessage });
    }
  },

  deletePost: async (postId) => {
    const user = useUser.getState().user; // Verifica o usuário para autorização

    if (!user) {
      set({ error: 'User is not authenticated' });
      return;
    }

    try {
      await axios.delete(`${baseUrl}/${postId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      set((state) => ({ posts: state.posts.filter((post) => post.id !== postId) }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting post';
      set({ error: errorMessage });
    }
  },
}));
