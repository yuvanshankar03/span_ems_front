import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';
import type { AuthContextType, Employer } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

interface AuthProviderProps { children: ReactNode }

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  const login = async (email: string, password: string) => {
    try{
      const response = await authService.login(email, password);
    setToken(response.token);
    return response;
    }
    catch(err:any){
      throw err.response?.data?.error || 'Failed to login';
    }
  };

  const register = async (employer: Employer) => {
    try{
      const response = await authService.register(employer);
      setToken(response.token);
      return response;
    }
    catch(err:any){
      throw err.response?.data?.error || 'Failed to register';
    }
  };

  const logout = () => setToken(null);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
