import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

/**
 * 🖥️ PANTALLA COMPLETA: Login
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-dark-700 via-dark-600 to-primary-600 px-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6">
        <!-- Header -->
        <div class="text-center">
          <div class="flex items-center justify-center space-x-2 mb-2">
            <span class="text-4xl">🐾</span>
            <h1 class="text-3xl font-bold">
              <span class="text-dark-700">Clínica</span><span class="text-primary-600">animal</span>
            </h1>
          </div>
          <p class="text-gray-600 text-sm">Sistema de Gestión Veterinaria</p>
        </div>

        <!-- Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <!-- Error Message -->
          @if (errorMessage()) {
            <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm flex items-start" role="alert">
              <svg class="w-5 h-5 mr-2 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input 
              id="email"
              type="email" 
              formControlName="email"
              placeholder="admin@clinica.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none"
              [class.border-red-300]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              [class.focus:ring-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <p class="text-xs text-red-600 mt-1">Ingrese un email válido</p>
            }
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input 
              id="password"
              type="password" 
              formControlName="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none"
              [class.border-red-300]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              [class.focus:ring-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <p class="text-xs text-red-600 mt-1">La contraseña es requerida</p>
            }
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            [disabled]="loginForm.invalid || loading()"
            class="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">
            @if (loading()) {
              <span class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            } @else {
              Iniciar Sesión
            }
          </button>

          <!-- Credentials Hint -->
          <div class="mt-6 bg-primary-50 border-l-4 border-primary-600 p-4 rounded-lg text-xs text-primary-900 space-y-1">
            <p class="font-semibold text-sm mb-2">🔑 Credenciales de prueba:</p>
            <div class="space-y-1.5 text-primary-800">
              <p><span class="font-medium">👑 Admin:</span> admin@clinica.com / admin123</p>
              <p><span class="font-medium">🩺 Veterinario:</span> veterinario@clinica.com / vet123</p>
              <p><span class="font-medium">📋 Recepción:</span> recepcion@clinica.com / recep123</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm: FormGroup;
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      const credentials = this.loginForm.value;

      // Usar login simulado (MOCK)
      this.authService.loginMock(credentials)
        .then(() => {
          this.loading.set(false);
          this.router.navigate(['/']);
        })
        .catch((error) => {
          this.loading.set(false);
          this.errorMessage.set(error.message || 'Usuario o contraseña incorrectos');
        });
    }
  }
}
