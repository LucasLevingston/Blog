import axios from 'axios';
import { create } from 'zustand';
import { loginSchema } from '../schemas/login-schema.ts';
import { registerSchema } from '../schemas/register-schema.ts';
import { LoggedUser, User } from '../types/User.ts';

const baseUrl = `${import.meta.env.VITE_BASE_URL}`;

type UserProps = {
  user: LoggedUser | null;
  setUser: (user: LoggedUser) => LoggedUser;
  clearUser: () => void;
  login: (loginData: { email: string; password: string }) => Promise<LoggedUser | null>;
  register: (registerData: {
    email: string;
    password: string;
    username: string;
  }) => Promise<User | null>;
};
const storedUser = localStorage.getItem('user');
const initialUser = storedUser ? JSON.parse(storedUser) : null;
console.log(storedUser);

export const useUser = create<UserProps>((set) => ({
  user: initialUser,
  setUser: (user) => {
    set({ user });
    return user;
  },
  clearUser: () => {
    set({ user: null });

    localStorage.removeItem('user');
  },

  login: async (loginData: { email: string; password: string }) => {
    loginSchema.parse(loginData);

    const response = await axios.post(`${baseUrl}/login`, loginData);

    if (!response || !response.data) {
      console.log(response);
      throw new Error('Error on login');
    }

    localStorage.setItem('user', JSON.stringify(response.data));

    const result = set({ user: response.data });
    console.log('Saved: ', result);
    return response.data;
  },

  register: async (registerData: {
    email: string;
    password: string;
    username: string;
  }) => {
    registerSchema.parse(registerData);

    const response = await axios.post(`${baseUrl}/register`, registerData);

    return response.data;
  },
}));
