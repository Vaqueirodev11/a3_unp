// Arquivo: src/services/authService.ts
import api, { setAuthToken, removeAuthToken } from './api';
import { LoginCredentials, RegisterCredentials, UpdatePasswordRequest, UpdateProfileRequest, User } from '../types/auth';

export const login = async (credentials: LoginCredentials) => {
  try {
    // Path deve ser relativo à baseURL ('/api') da instância 'api'
    const response = await api.post('/admin/login', credentials);
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData: RegisterCredentials) => {
  try {
    // Path deve ser relativo à baseURL ('/api') da instância 'api'
    const response = await api.post('/admin/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  try {
    removeAuthToken();
    return true;
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return false;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    // Path alterado para o novo endpoint no AdminController
    const response = await api.get('/admin/me'); // <<--- CORREÇÃO AQUI
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (data: UpdateProfileRequest) => {
  try {
    // Verifique se este endpoint existe no seu backend e se o path está correto
    // Ex: /api/admin/profile se for um endpoint de admin
    const response = await api.put('/admin/profile', data); // ASSUMINDO QUE O ENDPOINT É /api/admin/profile
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    // Verifique se este endpoint existe no seu backend e se o path está correto
    // Ex: /api/admin/password-reset-request
    const response = await api.post('/admin/password-reset-request', { email }); // ASSUMINDO QUE O ENDPOINT É /api/admin/password-reset-request
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (data: UpdatePasswordRequest) => {
  try {
    // Verifique se este endpoint existe no seu backend e se o path está correto
    // Ex: /api/admin/reset-password
    const response = await api.post('/admin/reset-password', data); // ASSUMINDO QUE O ENDPOINT É /api/admin/reset-password
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    // Verifique se este endpoint existe no seu backend e se o path está correto
    // Ex: /api/admin/change-password
    const response = await api.post('/admin/change-password', { // ASSUMINDO QUE O ENDPOINT É /api/admin/change-password
      senhaAtual: currentPassword,
      novaSenha: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};