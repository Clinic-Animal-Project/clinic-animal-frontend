import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente de pie de página con diseño Tailwind
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p class="text-sm text-gray-600">
            &copy; 2026 <span class="font-semibold text-dark-700">Clínica</span><span class="font-semibold text-primary-600">animal</span>. Todos los derechos reservados.
          </p>
          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <span class="flex items-center space-x-1">
              <span>Versión</span>
              <span class="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">1.0.0</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {}
