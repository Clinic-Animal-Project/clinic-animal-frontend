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
  ADMIN = 'ADMIN',
  EMPLEADO = 'EMPLEADO',
}

export interface LoginCredentials {
  nombreUsuario: string;
  claveUsuario: string;
}

export interface AuthResponse {
  success: boolean;
  mensaje: string;
  data: string; //token
}

export interface UserPayload{
  username: string; 
  rol: UserRole; 
}
