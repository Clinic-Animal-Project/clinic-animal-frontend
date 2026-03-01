import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-700 via-dark-600 to-primary-600 p-6">
      <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 border-2 border-[var(--color-primary-300)] animate-in fade-in zoom-in-95 duration-500">
        
        <div class="text-center mb-8">
          <div class="flex items-center justify-center gap-3 mb-2">
            <span class="text-4xl">🐾</span>
            <h1 class="text-3xl font-black uppercase tracking-tighter">
              <span class="text-dark-700">Clínica</span><span class="text-primary-600">animal</span>
            </h1>
          </div>
          <p class="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Gestión Veterinaria</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          
          @if (errorMessage()) {
            <div class="bg-rose-50 border-2 border-rose-100 text-rose-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top-2">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <div class="space-y-2">
            <label for="nombreUsuario" class="block text-[10px] font-black text-dark-400 uppercase tracking-widest ml-1">
              Nombre de Usuario
            </label>
            <div class="relative">
              <input 
                id="nombreUsuario"
                type="text" 
                formControlName="nombreUsuario"
                placeholder="admin"
                class="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-dark-700 focus:bg-white focus:border-primary-500 transition-all outline-none"
                [class.!border-rose-300]="loginForm.get('nombreUsuario')?.invalid && loginForm.get('nombreUsuario')?.touched">
            </div>
            @if (loginForm.get('nombreUsuario')?.invalid && loginForm.get('nombreUsuario')?.touched) {
              <p class="text-[10px] text-rose-500 font-bold uppercase tracking-tight ml-1">El usuario es requerido</p>
            }
          </div>

          <div class="space-y-2">
            <label for="claveUsuario" class="block text-[10px] font-black text-dark-400 uppercase tracking-widest ml-1">
              Contraseña
            </label>
            <div class="relative">
              <input 
                id="claveUsuario"
                type="password" 
                formControlName="claveUsuario"
                placeholder="••••••••"
                class="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-dark-700 focus:bg-white focus:border-primary-500 transition-all outline-none"
                [class.!border-rose-300]="loginForm.get('claveUsuario')?.invalid && loginForm.get('claveUsuario')?.touched">
            </div>
            @if (loginForm.get('claveUsuario')?.invalid && loginForm.get('claveUsuario')?.touched) {
              <p class="text-[10px] text-rose-500 font-bold uppercase tracking-tight ml-1">La contraseña es requerida</p>
            }
          </div>

          <button 
            type="submit"
            [disabled]="loginForm.invalid || loading()"
            class="w-full bg-primary-600 text-white font-black uppercase tracking-widest py-4 px-6 rounded-2xl hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary-600/20 active:scale-95 flex items-center justify-center gap-3">
            @if (loading()) {
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Verificando...</span>
            } @else {
              <span>Acceder al Panel</span>
            }
          </button>

          <p class="text-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
            © 2026 Clínicanimal Software
          </p>

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
      nombreUsuario: ['', Validators.required],
      claveUsuario: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.loading.set(false);
          this.errorMessage.set(error.error?.mensaje || 'Credenciales inválidas');
        }
      });
    }
  }
}