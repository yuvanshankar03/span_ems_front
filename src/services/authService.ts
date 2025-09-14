import type { Employer } from '../types';
import { api } from './api';


export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (employer: Employer) => {
    const response = await api.post('/auth/signup', employer);
    return response.data;
  },
};