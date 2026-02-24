import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { User, LoginCredentials, AuthResponse, UserRole } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Signal para el usuario actual (Angular 18+)
  currentUser = signal<User | null>(null);
  
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor() {
    // Cargar usuario del localStorage al iniciar
    this.loadUserFromStorage();
  }

  /**
   * Iniciar sesión (MOCK - Sin backend)
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setSession(response);
        })
      );
  }

  /**
   * Login simulado para DESARROLLO (sin backend)
   * CREDENCIALES DE PRUEBA:
   * - admin@clinica.com / admin123
   * - veterinario@clinica.com / vet123
   * - recepcion@clinica.com / recep123
   */
  loginMock(credentials: LoginCredentials): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Base de datos simulada de usuarios
        const mockUsers: Record<string, { user: User; password: string }> = {
          'admin@clinica.com': {
            password: 'admin123',
            user: {
              id: 'usr_001',
              email: 'admin@clinica.com',
              firstName: 'Juan',
              lastName: 'Administrador',
              role: UserRole.ADMIN,
              isActive: true,
              createdAt: new Date('2026-01-01')
            }
          },
          'veterinario@clinica.com': {
            password: 'vet123',
            user: {
              id: 'usr_002',
              email: 'veterinario@clinica.com',
              firstName: 'María',
              lastName: 'Veterinaria',
              role: UserRole.VETERINARIAN,
              isActive: true,
              createdAt: new Date('2026-01-01')
            }
          },
          'recepcion@clinica.com': {
            password: 'recep123',
            user: {
              id: 'usr_003',
              email: 'recepcion@clinica.com',
              firstName: 'Ana',
              lastName: 'Recepcionista',
              role: UserRole.RECEPTIONIST,
              isActive: true,
              createdAt: new Date('2026-01-01')
            }
          }
        };

        const mockUser = mockUsers[credentials.email];

        if (mockUser && mockUser.password === credentials.password) {
          // Login exitoso
          const response: AuthResponse = {
            user: mockUser.user,
            token: 'mock_token_' + Date.now(),
            refreshToken: 'mock_refresh_' + Date.now()
          };
          this.setSession(response);
          resolve(response);
        } else {
          // Credenciales inválidas
          reject({ message: 'Usuario o contraseña incorrectos' });
        }
      }, 500); // Simular delay de red
    });
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const isExpired = token ? this.isTokenExpired(token) : true;
    return !!token && !isExpired;
  }

  /**
   * Obtener el token actual
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role;
  }

  /**
   * Guardar la sesión
   */
  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
    this.currentUser.set(authResponse.user);
  }

  /**
   * Cargar usuario del localStorage
   */
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUser.set(user);
    }
  }

  /**
   * Verificar si el token ha expirado
   */
  private isTokenExpired(token: string): boolean {
    // Si es un token mockeado, considerarlo siempre válido
    if (token.startsWith('mock_token_')) {
      return false; // No está expirado
    }

    // Si es un JWT real, verificar expiración
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() > expiry;
    } catch (error) {
      // Si hay error al decodificar, considerar expirado
      return true;
    }
  }
}
