import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nahnustd.com/backend/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to attach Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nahnu_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle token expiry / unauthenticated
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    if (window.location.pathname.includes('/admin') && !window.location.pathname.includes('login.html')) {
      localStorage.removeItem('nahnu_admin_token');
      localStorage.removeItem('nahnu_admin_user');
      window.location.href = '/admin/login.html';
    }
  }
  return Promise.reject(error);
});

// Public API helpers
export const fetchPublicProjects = (params = {}) => api.get('/projects', { params });
export const fetchPublicProjectDetail = (slug) => api.get(`/projects/${slug}`);
export const fetchPublicCategories = () => api.get('/categories');
export const fetchPublicTechnologies = () => api.get('/technologies');
export const fetchPublicTeamMembers = () => api.get('/team-members');
export const submitContactMessage = (data) => api.post('/contact', data);

// Admin API helpers
export const adminLogin = (credentials) => api.post('/admin/login', credentials);
export const adminLogout = () => api.post('/admin/logout');
export const adminGetMe = () => api.get('/admin/me');
export const adminGetDashboard = () => api.get('/admin/dashboard');
export const adminGetProfile = () => api.get('/admin/profile');
export const adminUpdateProfile = (data) => api.put('/admin/profile', data);
export const adminUpdatePassword = (data) => api.put('/admin/profile/password', data);

// Admin Projects
export const adminGetProjects = (params = {}) => api.get('/admin/projects', { params });
export const adminGetProject = (id) => api.get(`/admin/projects/${id}`);
export const adminCreateProject = (formData) => api.post('/admin/projects', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const adminUpdateProject = (id, formData) => api.post(`/admin/projects/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const adminDeleteProject = (id) => api.delete(`/admin/projects/${id}`);

// Admin Categories
export const adminGetCategories = () => api.get('/admin/categories');
export const adminCreateCategory = (data) => api.post('/admin/categories', data);
export const adminUpdateCategory = (id, data) => api.put(`/admin/categories/${id}`, data);
export const adminDeleteCategory = (id) => api.delete(`/admin/categories/${id}`);

// Admin Technologies
export const adminGetTechnologies = () => api.get('/admin/technologies');
export const adminCreateTechnology = (data) => api.post('/admin/technologies', data);
export const adminUpdateTechnology = (id, data) => api.put(`/admin/technologies/${id}`, data);
export const adminDeleteTechnology = (id) => api.delete(`/admin/technologies/${id}`);

// Admin Team Members
export const adminGetTeamMembers = () => api.get('/admin/team-members');
export const adminGetTeamMember = (id) => api.get(`/admin/team-members/${id}`);
export const adminCreateTeamMember = (formData) => api.post('/admin/team-members', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const adminUpdateTeamMember = (id, formData) => api.post(`/admin/team-members/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const adminDeleteTeamMember = (id) => api.delete(`/admin/team-members/${id}`);

// Admin Messages
export const adminGetMessages = (params = {}) => api.get('/admin/messages', { params });
export const adminGetMessage = (id) => api.get(`/admin/messages/${id}`);
export const adminToggleMessageRead = (id) => api.patch(`/admin/messages/${id}/toggle-read`);
export const adminDeleteMessage = (id) => api.delete(`/admin/messages/${id}`);
