import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';

/**
 * Layout principal con diseño Tailwind
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-gray-50">
      <app-header></app-header>
      
      <div class="flex flex-1">
        <app-sidebar></app-sidebar>
        
        <main class="flex-1 overflow-y-auto bg-gray-50" style="padding: 1.5rem 2rem;">
          <router-outlet></router-outlet>
        </main>
      </div>

      <app-footer></app-footer>
    </div>
  `,
  styles: []
})
export class MainLayoutComponent {}
