import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/**
 * Componente de encabezado/header con diseño Tailwind y colores del logo
 */
@Component({
  selector: 'app-header',
  imports: [CommonModule],
  template: `
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md">
      <div class="max-w-full mx-auto" style="padding-left: 2rem; padding-right: 2rem;">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              🐾
            </div>
            <h1 class="text-2xl font-bold">
              <span class="text-dark-700">Clínica</span><span class="text-primary-600">animal</span>
            </h1>
          </div>

          <!-- User Menu -->
          @if (authService.currentUser()) {
            <div class="flex items-center gap-4">
              <!-- User Info -->
              <div class="hidden md:flex items-center gap-3">
                <div class="text-right">
                  <p class="text-sm font-semibold text-dark-700">
                    {{ authService.currentUser()?.username }} {{ authService.currentUser()?.username }}
                  </p>
                  <p class="text-xs text-gray-500 capitalize">
                    {{ authService.currentUser()?.rol }}
                  </p>
                </div>
                <div class="w-10 h-10 bg-linear-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg ring-2 ring-primary-200 shrink-0">
                  <span class="text-white font-bold text-lg">
                    {{ authService.currentUser()?.username?.charAt(0) }}
                  </span>
                </div>
              </div>

              <!-- Logout Button -->
              <button 
                (click)="logout()"
                class="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-md hover:shadow-lg hover:scale-105 shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Salir
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
  }
}
