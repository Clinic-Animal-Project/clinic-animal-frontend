import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside style="width: 16rem; padding-left: 1rem; padding-right: 1rem;" class="bg-linear-to-b from-primary-700 via-primary-800 to-primary-900 min-h-[calc(100vh-4rem)] shadow-2xl relative">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-20 left-0 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <nav class="flex flex-col py-6 relative z-10 space-y-1">

        <!-- Inicio -->
        <a
          routerLink="/"
          routerLinkActive="bg-white/95 text-primary-700 shadow-lg"
          [routerLinkActiveOptions]="{exact: true}"
          class="group flex items-center space-x-3 py-3.5 text-primary-50 hover:bg-white/15 rounded-xl transition-all duration-200" style="padding-left: 1rem; padding-right: 1rem;">
          <div class="w-10 h-10 bg-primary-600/30 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span class="font-semibold text-sm">Inicio</span>
        </a>

        <!-- Clientes -->
        <a
          routerLink="/clientes"
          routerLinkActive="bg-white/95 text-primary-700 shadow-lg"
          class="group flex items-center space-x-3 py-3.5 text-primary-50 hover:bg-white/15 rounded-xl transition-all duration-200" style="padding-left: 1rem; padding-right: 1rem;">
          <div class="w-10 h-10 bg-primary-600/30 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span class="font-semibold text-sm">Clientes</span>
        </a>

        <!-- Mascotas -->
        <a
          routerLink="/mascotas"
          routerLinkActive="bg-white/95 text-primary-700 shadow-lg"
          class="group flex items-center space-x-3 py-3.5 text-primary-50 hover:bg-white/15 rounded-xl transition-all duration-200" style="padding-left: 1rem; padding-right: 1rem;">
          <div class="w-10 h-10 bg-primary-600/30 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121A3 3 0 1 0 9.88 9.88a3 3 0 0 0 4.242 4.242zM5 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm14 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            </svg>
          </div>
          <span class="font-semibold text-sm">Mascotas</span>
        </a>

        <!-- Citas -->
        <a
          routerLink="/citas"
          routerLinkActive="bg-white/95 text-primary-700 shadow-lg"
          class="group flex items-center space-x-3 py-3.5 text-primary-50 hover:bg-white/15 rounded-xl transition-all duration-200" style="padding-left: 1rem; padding-right: 1rem;">
          <div class="w-10 h-10 bg-primary-600/30 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="font-semibold text-sm">Citas</span>
        </a>

        <!-- Separator -->
        <div class="py-3">
          <div class="h-px bg-primary-600/30"></div>
        </div>

        <!-- Mantenimiento Dropdown -->
        <div>
          <button
            (click)="toggleMantenimiento()"
            class="group flex items-center justify-between w-full py-3.5 text-primary-50 hover:bg-white/15 rounded-xl transition-all duration-200" style="padding-left: 1rem; padding-right: 1rem;">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-primary-600/30 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span class="font-semibold text-sm">Mantenimiento</span>
            </div>
            <svg
              class="w-5 h-5 transition-transform duration-200"
              [class.rotate-180]="mantenimientoOpen()"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          @if (mantenimientoOpen()) {
            <div class="mt-1 space-y-1" style="margin-left: 0.5rem;">
              <a
                routerLink="/mantenimiento/clientes"
                routerLinkActive="bg-white/20 text-white"
                class="flex items-center gap-2 py-2.5 text-primary-200 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200 text-sm font-medium" style="padding-left: 1rem; padding-right: 1rem;">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Clientes
              </a>
              <a
                routerLink="/mantenimiento/mascotas"
                routerLinkActive="bg-white/20 text-white"
                class="flex items-center gap-2 py-2.5 text-primary-200 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200 text-sm font-medium" style="padding-left: 1rem; padding-right: 1rem;">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121A3 3 0 1 0 9.88 9.88a3 3 0 0 0 4.242 4.242zM5 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm14 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                </svg>
                Mascotas
              </a>
            </div>
          }
        </div>

      </nav>
    </aside>
  `,
  styles: []
})
export class SidebarComponent {
  mantenimientoOpen = signal(false);

  toggleMantenimiento() {
    this.mantenimientoOpen.update(value => !value);
  }
}
