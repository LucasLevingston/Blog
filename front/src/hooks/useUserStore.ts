import axios from 'axios';
import { loginSchema } from '../schemas/login-schema.ts';
import { useUserStore } from './user.store.ts';

const baseUrl = `${import.meta.env.VITE_BASE_URL}`;

export const loginUser = async (credentials: { email: string; password: string }) => {
  // Validação das credenciais
  loginSchema.parse(credentials);

  // Fazendo a requisição de login
  const response = await axios.post(`${baseUrl}/login`, credentials);

  if (!response || !response.data) {
    console.log(response);
    throw new Error('Error on login');
  }

  // Armazenando o usuário no localStorage
  localStorage.setItem('user', JSON.stringify(response.data));

  // Atualizando o estado do usuário no Zustand
  const setUser = useUserStore.getState().setUser;
  setUser(response.data.user); // Supondo que a resposta tenha a propriedade 'user'

  return response;
};
