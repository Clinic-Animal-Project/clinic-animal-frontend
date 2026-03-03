import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, LoginCredentials, AuthResponse, UserPayload } from '../models/user.model';
import { JwtDecoderService } from './jwt-decoder.service';
import { API_ROUTES } from '../constants/api-routes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private jwtDecoder = inject(JwtDecoderService);
  
  // Signal para el usuario actual (Angular 18+)
  currentUser = signal<UserPayload | null>(null);
  
  private readonly API_URL = `${API_ROUTES.AUTH}/usuario/login`; // URL del backend de autenticación

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor() {
    // Cargar usuario del sessionStorage al iniciar
    this.loadUserFromStorage();
  }

  /**
   * Iniciar sesión (MOCK - Sin backend)
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.API_URL, credentials)
      .pipe(
        tap(response => {
          this.setSession(response);
          console.log({response})
        })
      );
  }


 /**
   * Guardar la sesión
   */
  private setSession(authResponse: AuthResponse): void {
    sessionStorage.setItem(this.TOKEN_KEY, authResponse.data);
    // Decodificar el token para obtener usuario y rol
    const decoded: any = this.jwtDecoder.decodeTokenFromString(authResponse.data);
    if (decoded) {
      const user: UserPayload = {
        username: decoded.sub,
        rol: decoded.rol
      };
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUser.set(user as UserPayload);
    }
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
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.rol === role;
  }

 

  /**
   * Cargar usuario del localStorage
   */
  private loadUserFromStorage(): void {
    const userJson = sessionStorage.getItem(this.USER_KEY);
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUser.set(user);
    }
  }

    /**
   * Cerrar sesión
   */
  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
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
