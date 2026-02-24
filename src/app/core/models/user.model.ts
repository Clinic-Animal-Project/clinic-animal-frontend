// Modelo de usuario compartido en toda la aplicación
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  VETERINARIAN = 'veterinarian',
  RECEPTIONIST = 'receptionist'
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
