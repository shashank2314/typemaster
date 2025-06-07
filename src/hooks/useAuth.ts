import { useState, useEffect } from 'react';
import { User } from '../types';
import { apiClient } from '../utils/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Verify token by making a request to get user stats
      apiClient.getStats()
        .then(() => {
          // Token is valid, but we need user info
          // For now, we'll decode the token (in production, get from server)
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({
              id: payload.userId.toString(),
              username: payload.username,
              email: payload.email,
              createdAt: new Date()
            });
          } catch (error) {
            console.error('Invalid token format');
            localStorage.removeItem('auth_token');
          }
        })
        .catch(() => {
          // Token is invalid
          localStorage.removeItem('auth_token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login(email, password);
      setUser({
        id: response.user.id.toString(),
        username: response.user.username,
        email: response.user.email,
        createdAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.register(username, email, password);
      setUser({
        id: response.user.id.toString(),
        username: response.user.username,
        email: response.user.email,
        createdAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
}