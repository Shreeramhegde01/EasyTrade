import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  imageUrl?: string;
  imageUrls?: string[];
  user: User;
  createdAt: string;
}

export interface Chat {
  id: number;
  buyer: User;
  seller: User;
  listing: Listing;
  createdAt: string;
}

export interface Message {
  id: number;
  sender: User;
  content: string;
  timestamp: string;
}

// ===== AUTH =====
export const register = (name: string, email: string, password: string, phone: string) =>
  api.post<AuthResponse>('/auth/register', { name, email, password, phone });

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password });

export const getProfile = () =>
  api.get<User>('/users/profile');

export const updateProfile = (data: { name?: string; email?: string; phone?: string; password?: string }) =>
  api.put<User>('/users/profile', data);

// ===== LISTINGS =====
export const getListings = () =>
  api.get<Listing[]>('/listings');

export const getListing = (id: number) =>
  api.get<Listing>(`/listings/${id}`);

export const createListing = (data: Partial<Listing>) =>
  api.post<Listing>('/listings', data);

export const updateListing = (id: number, data: Partial<Listing>) =>
  api.put<Listing>(`/listings/${id}`, data);

export const deleteListing = (id: number) =>
  api.delete(`/listings/${id}`);

export const searchListings = (keyword: string) =>
  api.get<Listing[]>(`/listings/search?keyword=${encodeURIComponent(keyword)}`);

export const getMyListings = () =>
  api.get<Listing[]>('/listings/my');

// ===== IMAGES =====
export const uploadImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<{ url: string }>('/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ===== CHAT =====
export const startChat = (listingId: number) =>
  api.post<Chat>('/chat/start', { listingId });

export const getMyChats = () =>
  api.get<Chat[]>('/chat/my');

export const sendMessage = (chatId: number, content: string) =>
  api.post<Message>(`/chat/${chatId}/message`, { content });

export const getMessages = (chatId: number) =>
  api.get<Message[]>(`/chat/${chatId}/messages`);

export const deleteChat = (chatId: number) =>
  api.delete(`/chat/${chatId}`);

// ===== HELPERS =====
export const isLoggedIn = (): boolean => !!localStorage.getItem('token');

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const saveAuth = (data: AuthResponse) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({
    id: data.userId,
    name: data.name,
    email: data.email,
  }));
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const formatPrice = (price: number): string => {
  return '₹' + price.toLocaleString('en-IN');
};

export const timeAgo = (dateStr: string): string => {
  // The backend on Render stores times in UTC. If the timestamp lacks 'Z', 
  // explicitly append it so the browser parses it correctly as UTC.
  const normalizedDateStr = dateStr.endsWith('Z') ? dateStr : `${dateStr}Z`;
  const now = new Date();
  const date = new Date(normalizedDateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
};
