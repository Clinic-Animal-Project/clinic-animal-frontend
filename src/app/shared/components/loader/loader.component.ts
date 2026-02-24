import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente de loader/spinner
 * Ejemplo de uso:
 * <app-loader [isLoading]="loading" message="Cargando datos..."></app-loader>
 */
@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isLoading()) {
      <div class="loader-container">
        <div class="spinner"></div>
        @if (message()) {
          <p class="message">{{ message() }}</p>
        }
      </div>
    }
  `,
  styles: [`
    .loader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e5e7eb;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .message {
      margin-top: 16px;
      color: #6b7280;
      font-size: 14px;
    }
  `]
})
export class LoaderComponent {
  isLoading = input.required<boolean>();
  message = input<string>('');
}
